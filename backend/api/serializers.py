from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Product, Order, Cart, OrderItem

User = get_user_model()

#User model serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

#Product model serializer
class ProductSerializer(serializers.ModelSerializer):
    price = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False)  # Ensure price is a number

    class Meta:
        model = Product
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source= "product.name", read_only= True)
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(queryset= Product.objects.all(), write_only =True)
    price = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False)  # Ensure price is a number

    class Meta:
        model = OrderItem
        fields = ['id','product_name', 'product', 'product_id', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many = True, read_only = True )
    user = serializers.ReadOnlyField(source='user.username')
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, required= False, read_only= True)
    status = serializers.CharField(read_only = True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'total_price', 'status', 'created_at', 'items']

class CartSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only = True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'product', 'quantity']
        extra_kwargs = {'user': {'read_only': True}}