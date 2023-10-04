from django.db import transaction
from django.db.models import Sum
from rest_framework import generics, mixins, status
from rest_framework.response import Response

from .models import Category, Order, OrderItem, Product
from .permissions import IsClient, IsSeller, IsSellerOrReadOnly
from .serializers import (
    CategorySerializer,
    DateRangeSerializer,
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
    permission_classes = [IsSellerOrReadOnly]

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
    permission_classes = [IsSeller]

    def get(self, request, *args, **kwargs):
        pk = kwargs.get(self.lookup_field)
        if pk is None:
            return self.list(request, *args, **kwargs)
        return self.retrieve(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class CreateOrderView(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsClient]

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
    permission_classes = [IsSeller]

    def get(self, request):
        serializer = DateRangeSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        validated_data = serializer.validated_data
        date_from = validated_data.get("date_from")
        date_to = validated_data.get("date_to")
        num_products = validated_data.get("num_products", 10)

        queryset = (
            OrderItem.objects.filter(order__order_date__range=(date_from, date_to))
            .values("product_id")
            .annotate(total_quantity_ordered=Sum("quantity"))
            .order_by("-total_quantity_ordered")[:num_products]
        )

        data = list(queryset)
        return Response(data)
