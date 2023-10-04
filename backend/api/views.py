from datetime import datetime

from django.core.exceptions import ValidationError
from django.db import transaction
from django.db.models import Sum
from django.utils.timezone import make_aware
from rest_framework import generics, mixins, status
from rest_framework.response import Response

from .models import Category, Order, OrderItem, Product
from .serializers import (
    CategorySerializer,
    OrderDetailSerializer,
    OrderItemSerializer,
    OrderSerializer,
    ProductSerializer,
)


class ProductMixinView(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView,
):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = "pk"

    # parser_classes = (MultiPartParser,)
    # permission_classes = [IsSellerOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()

        name_filter = self.request.GET.get("name")
        if name_filter:
            queryset = queryset.filter(name__icontains=name_filter)

        description_filter = self.request.GET.get("description")
        if description_filter:
            queryset = queryset.filter(description__icontains=description_filter)

        price_filter = self.request.GET.get("price")
        if price_filter:
            queryset = queryset.filter(price=price_filter)

        category_filter = self.request.GET.get("category")
        if category_filter:
            queryset = queryset.filter(category__name__icontains=category_filter)

        ordering = self.request.GET.get("ordering", "name")
        if ordering.startswith("-"):
            queryset = queryset.order_by(ordering[1:])
        else:
            queryset = queryset.order_by(ordering)
        queryset = queryset.order_by(ordering)

        return queryset

    def get(self, request, *args, **kwargs):
        pk = kwargs.get(self.lookup_field)
        if pk is None:
            return self.list(request, *args, **kwargs)
        return self.retrieve(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        pk = kwargs.get(self.lookup_field)
        if pk is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        pk = kwargs.get(self.lookup_field)
        if pk is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return self.destroy(request, *args, **kwargs)


class ProductCategoryMixinView(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    generics.GenericAPIView,
):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = "pk"

    def get(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        if pk is None:
            return self.list(request, *args, **kwargs)
        return self.retrieve(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class CreateOrderView(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def create(self, request):
        order_items_data = request.data.get("order_items", [])
        order_serializer = self.serializer_class(data=request.data)
        order_serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            order = order_serializer.save()
            total_price = 0

            for item_data in order_items_data:
                item_data["order"] = order.id
                item_serializer = OrderItemSerializer(data=item_data)
                item_serializer.is_valid(raise_exception=True)
                item = item_serializer.save(order=order)

                product = item.product
                if item.quantity > product.quantity:
                    return Response(
                        f"Cannot order {item.quantity} of {product.name}, only {product.quantity} available",
                        status=status.HTTP_409_CONFLICT,
                    )

                product.quantity -= item.quantity
                product.save()

                total_price += item.quantity * product.price

            order.total_price = total_price
            order.save()

        return Response(order_serializer.data, status=status.HTTP_201_CREATED)


class OrderStatsView(generics.ListAPIView):
    serializer_class = OrderDetailSerializer

    def get_queryset(self):
        date_from = self.request.GET.get("date_from")
        date_to = self.request.GET.get("date_to")
        num_products = int(self.request.GET.get("num_products", 10))

        if date_from is None or date_to is None:
            raise ValidationError("Both 'date_from' and 'date_to' are required.")
        try:
            date_from = make_aware(datetime.strptime(date_from, "%Y-%m-%d"))
            date_to = make_aware(datetime.strptime(date_to, "%Y-%m-%d"))
        except ValueError:
            raise ValidationError("Invalid date format. Please use YYYY-MM-DD.")

        if date_from > date_to:
            raise ValidationError(
                "Invalid date range. 'date_from' must be before 'date_to'."
            )

        queryset = (
            OrderItem.objects.filter(order__order_date__range=(date_from, date_to))
            .values("product_id")
            .annotate(total_quantity_ordered=Sum("quantity"))
            .order_by("-total_quantity_ordered")[:num_products]
        )

        return queryset
