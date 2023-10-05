from collections import OrderedDict

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Category, Order, OrderItem, Product, User


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


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username", "first_name", "last_name", "email")

    def to_representation(self, instance):
        result = super(UserSerializer, self).to_representation(instance)
        result["role_name"] = instance.get_role_name()
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


class DateRangeSerializer(serializers.Serializer):
    date_from = serializers.DateField(input_formats=["%Y-%m-%d"])
    date_to = serializers.DateField(input_formats=["%Y-%m-%d"])
    num_products = serializers.IntegerField(default=10)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user: User):
        token = super().get_token(user)
        token["role_name"] = user.get_role_name()
        token["username"] = user.username
        token["first_name"] = user.first_name
        token["last_name"] = user.last_name
        token["email"] = user.email

        return token
