import requests
import random
from rest_framework.response import Response
from rest_framework import status, generics, permissions, viewsets
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly, IsAdminUser
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, redirect
from django.conf import settings
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from django.db import transaction
from django.db.models import Q
from .serializers import UserSerializer, ProductSerializer, OrderSerializer, CartSerializer
from .models import Product, Order, Cart, OrderItem
from .utils import generate_esewa_payment_url, calculate_shipping_cost, verify_esewa_payment
from django.core.mail import send_mail

User = get_user_model()

# Login for token
class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        return Response({"token": response.data["access"], "refresh": response.data["refresh"]})

# Register new users and give token
@api_view(["POST"])
def register(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    if User.objects.filter(username=username).exists():
        return Response({"error": "User already exists"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({"error": "Email already in use"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, password=password)
    return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)

# Product Views
class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

# Order Views
class OrderListCreateView(generics.ListCreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@api_view(["POST"])
def create_order(request):
    user = request.user
    total_price = request.data.get("total_price")
    shipping_address = request.data.get("shipping_address")
    city = request.data.get("city")

    shipping_cost = calculate_shipping_cost(city, total_price)
    if shipping_cost is None:
        return Response({"error": "Shipping is only available in Kathmandu, Bhaktapur, and Lalitpur."}, status=400)

    order = Order.objects.create(
        user=user,
        total_price=total_price,
        shipping_address=shipping_address,
        city=city,
        shipping_cost=shipping_cost,
    )
    return Response(OrderSerializer(order).data)

@api_view(["GET"])
def get_orders(request):
    orders = Order.objects.all()
    return Response(OrderSerializer(orders, many=True).data)

@api_view(["PATCH"])
def update_order_status(request, order_id):
    order = Order.objects.get(id=order_id)
    order.status = request.data.get("status", order.status)
    order.save()
    return Response({"message": "Order updated successfully!"})

# Cart Views
class CartListCreateView(generics.ListCreateAPIView):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        user = self.request.user
        product = serializer.validated_data["product"]
        quantity = serializer.validated_data["quantity"]

        existing_cart_item = Cart.objects.filter(user=user, product=product).first()
        if existing_cart_item:
            existing_cart_item.quantity += quantity
            existing_cart_item.save()
        else:
            serializer.save(user=user)

class CartDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

# Checkout
class CheckoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        cart_items = Cart.objects.filter(user=user)

        if not cart_items:
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        total_price = sum(item.product.price * item.quantity for item in cart_items)

        with transaction.atomic():
            order = Order.objects.create(user=user, total_price=total_price)
            for item in cart_items:
                OrderItem.objects.create(order=order, product=item.product, quantity=item.quantity, price=item.product.price)
                item.product.stock -= item.quantity
                item.product.save()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

# eSewa Payment
@api_view(["POST"])
def esewa_payment(request):
    order_id = request.data.get("order_id")
    amount = request.data.get("amount")
    esewa_redirect_url = generate_esewa_payment_url(order_id, amount)
    return Response({"esewa_url": esewa_redirect_url})

@api_view(["GET"])
def esewa_success(request):
    order_id = request.GET.get("oid")
    ref_id = request.GET.get("refId")
    amount = request.GET.get("amt")
    if verify_esewa_payment(order_id, ref_id, amount):
        return Response({"message": "Payment successful!", "order_id": order_id, "reference_id": ref_id})
    return Response({"error": "Payment verification failed!"}, status=400)

@api_view(["GET"])
def esewa_failure(request):
    return Response({"message": "Payment failed!"})

# Admin Dashboard
@api_view(["GET"])
@permission_classes([IsAdminUser])
def get_admin_dashboard(request):
    products = Product.objects.all()
    orders = Order.objects.all()
    return Response({
        "total_products": products.count(),
        "total_orders": orders.count(),
        "products": ProductSerializer(products, many=True).data,
        "orders": OrderSerializer(orders, many=True).data,
    })

@api_view(["GET"])
def search_products(request):
    query = request.GET.get("q", "")
    products = Product.objects.filter(
        Q(name__icontains=query) | Q(description__icontains=query)
    )
    return Response(ProductSerializer(products, many=True).data)

@api_view(["GET"])
def recommend_products(request, product_id):
    product = Product.objects.get(id=product_id)
    
    # Content-Based Filtering (same category)
    recommendations = Product.objects.filter(category=product.category).exclude(id=product.id)

    # Collaborative Filtering (randomized for now)
    random_recommendations = random.sample(list(Product.objects.all()), min(5, Product.objects.count()))

    return Response(ProductSerializer(recommendations | random_recommendations, many=True).data)


def send_order_update_email(order):
    subject = f"Order Update: {order.tracking_code}"
    message = f"Your order {order.tracking_code} is now {order.status}."
    recipient = order.user.email

    send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        [recipient],
        fail_silently=False,
    )

@api_view(["PATCH"])
def update_order_status(request, order_id):
    order = Order.objects.get(id=order_id)
    new_status = request.data.get("status", order.status)

    if order.status != new_status:
        order.status = new_status
        order.save()
        send_order_update_email(order)

    return Response({"message": f"Order {order.tracking_code} updated to {new_status}."})

#Track order
@api_view(["GET"])
def track_order(request, tracking_code):
    try:
        order = Order.objects.get(tracking_code=tracking_code)
        return Response(OrderSerializer(order).data)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=404)