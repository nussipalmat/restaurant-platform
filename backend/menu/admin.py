from django.contrib import admin
from menu.models import MenuCategory, MenuItem


@admin.register(MenuCategory)
class MenuCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'restaurant', 'order', 'is_active']
    list_filter = ['restaurant', 'is_active']
    search_fields = ['name', 'restaurant__name']
    ordering = ['order', 'name']


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'restaurant', 'category', 'price', 'is_available', 'order_count']
    list_filter = ['restaurant', 'category', 'is_available', 'is_vegetarian', 'is_vegan']
    search_fields = ['name', 'restaurant__name']
    ordering = ['category', 'name']

