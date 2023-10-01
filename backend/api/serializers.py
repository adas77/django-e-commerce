from rest_framework import serializers

from .models import Category, Order, OrderItem, Product


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.SerializerMethodField()
    class Meta:
        model = Product
        fields = '__all__'
        
    def get_category(self, obj):
        category_id = obj.category.id
        try:
            category_name = Category.objects.get(id=category_id).name
            return category_name
        except Category.DoesNotExist:
            return None

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderDetailSerializer(serializers.Serializer):
    product_id=serializers.IntegerField()
    total_quantity_ordered=serializers.IntegerField()
    

class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
