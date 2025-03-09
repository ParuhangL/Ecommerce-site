from django.urls import path
from .views import register, CustomTokenObtainPairView, ProductListCreateView, ProductDetailView, OrderListCreateView, CartListCreateView, CartDetailView, CheckoutView, get_admin_dashboard
from .views import search_products, recommend_products, track_order, esewa_failure,esewa_payment,esewa_success, create_order, get_orders, update_order_status
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("admin/dashboard/", get_admin_dashboard, name="admin_dashboard"),
    path('auth/register/', register, name='register'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name = 'token_refresh'),
    path('products/', ProductListCreateView.as_view(), name = 'product-list-create'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name = 'product-detail'),
    path("orders/create/", create_order, name="create_order"),
    path("orders/", get_orders, name="get_orders"),
    path("orders/<int:order_id>/update/", update_order_status, name="update_order_status"),
    path('cart/', CartListCreateView.as_view(), name= 'cart-list-create'),
    path('cart/<int:pk>/', CartDetailView.as_view(), name = 'cart-detail'),
    path('checkout/', CheckoutView.as_view(), name ='checkout'),
    path("esewa/payment/", esewa_payment, name="esewa_payment"),
    path("esewa/success/", esewa_success, name="esewa_success"),
    path("esewa/failure/", esewa_failure, name="esewa_failure"),
    path("products/search/", search_products, name ="search_products"),
    path('products/<int:product_id>/recommend/', recommend_products, name='recommend_products'),
    path("orders/track/<str:tracking_code>/", track_order, name="track_order"),
]


