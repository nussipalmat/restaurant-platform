from django.contrib import admin
from orders.models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['subtotal']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'user', 'restaurant', 'status', 'total', 'is_paid', 'created_at']
    list_filter = ['status', 'order_type', 'is_paid', 'created_at']
    search_fields = ['order_number', 'user__email', 'restaurant__name']
    readonly_fields = ['order_number']
    ordering = ['-created_at']
    inlines = [OrderItemInline]


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'menu_item', 'quantity', 'unit_price', 'subtotal']
    list_filter = ['order__created_at']
    search_fields = ['order__order_number', 'menu_item__name']

