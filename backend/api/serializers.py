from collections import OrderedDict

from rest_framework import serializers

from .models import Category, Order, OrderItem, Product


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"

    def to_representation(self, instance):
        result = super(ProductSerializer, self).to_representation(instance)
        result["category"] = Category.objects.get(id=result["category"]).name
        return OrderedDict(
            [(key, result[key]) for key in result if result[key] is not None]
        )


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ("product", "quantity")


class OrderDetailSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    total_quantity_ordered = serializers.IntegerField()


class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = "__all__"
