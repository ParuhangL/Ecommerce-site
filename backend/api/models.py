from django.db import models
from django.contrib.auth.models import AbstractUser

#Custom user model
class User(AbstractUser):
    email = models.EmailField(unique=True)
    is_admin = models.BooleanField(default=False)

    def __str__(self):
        return self.username

#Product Model
class Product(models.Model):
    name = models.CharField(max_length=50, db_index=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, db_index=True)
    stock = models.IntegerField(default=0)
    image = models.ImageField(upload_to='product_images/', blank = True, null= True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
#Order model
class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("shipped", "Shipped"),
        ("out_for_delivery", "Out for Delivery"),
        ("delivered", "Delivered"),
    ]

    ALLOWED_CITIES = ["kathmandu", "bhaktapur", "lalitpur"]

    user = models.ForeignKey(User, on_delete= models.CASCADE)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipping_address = models.TextField(max_length=255, default = "Unknown")
    city = models.CharField(max_length=50, default="kathmandu")
    shipping_cost = models.DecimalField(max_digits=5, decimal_places= 2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default = 'pending')
    tracking_code = models.CharField(max_length=20, unique=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def calculate_shipping_cost(self):
        if self.city.lower() not in self.ALLOWED_CITIES:
            return None
        return 0 if self.total_price >= 5000 else 70

    def save(self, *args, **kwargs):
        shipping_fee = self.calculate_shipping_cost()
        if shipping_fee is None:
            raise ValueError("Shipping is only available in Kathmandu, Bhaktapur, and Lalitpur.")

        self.shipping_cost = shipping_fee

        if not self.tracking_code:
            self.tracking_code = f"TRK{self.id:06d}" 

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Order {self.tracking_code or 'Pending'} by {self.user.username} - {self.status}"
    
class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cart")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default = 1)
    created_at = models.DateTimeField(auto_now_add= True)

    def __str__(self):
        return f"{self.quantity} x {self.product.name} in {self.user.username}'s cart"
    
class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product.name} (Order {self.order.id})"