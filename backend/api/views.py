from rest_framework import generics, mixins

from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer


class ProductMixinView(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    generics.GenericAPIView
):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'pk'

    # parser_classes = (MultiPartParser,)
    # permission_classes = [IsSellerOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()

        name_filter = self.request.GET.get('name')
        if name_filter:
            queryset = queryset.filter(name__icontains=name_filter)

        description_filter = self.request.GET.get('description')
        if description_filter:
            queryset = queryset.filter(
                description__icontains=description_filter)

        price_filter = self.request.GET.get('price')
        if price_filter:
            queryset = queryset.filter(price=price_filter)

        category_filter = self.request.GET.get('category')
        if category_filter:
            queryset = queryset.filter(
                category__name__icontains=category_filter)

        ordering = self.request.GET.get('ordering', 'name')
        if ordering.startswith('-'):
            queryset = queryset.order_by(ordering[1:])
        else:
            queryset = queryset.order_by(ordering)
        queryset = queryset.order_by(ordering)

        return queryset

    def get(self, request, *args, **kwargs):
        print(args, kwargs)
        pk = kwargs.get('pk')
        if pk is None:
            return self.list(request, *args, **kwargs)
        return self.retrieve(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class ProductCategoryMixinView(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    generics.GenericAPIView
):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'pk'

    def get(self, request, *args, **kwargs):
        print(args, kwargs)
        pk = kwargs.get('pk')
        if pk is None:
            return self.list(request, *args, **kwargs)
        return self.retrieve(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
