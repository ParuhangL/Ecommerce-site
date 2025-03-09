from django.contrib import admin
from .models import Product, Order, OrderItem
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

User = get_user_model()

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0  # Prevent adding empty order items

class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'total_price', 'status', 'created_at']
    inlines = [OrderItemInline]

class CustomUserAdmin(UserAdmin):
    # Define the fields to be used in displaying the User model.
    list_display = ('email', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Permissions', {'fields': ('is_staff', 'is_active')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )
    search_fields = ('email',)
    ordering = ('email',)


admin.site.register(Product)
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem)



admin.site.register(User, CustomUserAdmin)