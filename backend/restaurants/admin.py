from django.contrib import admin
from restaurants.models import Restaurant, RestaurantImage, Review, Table


@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'city', 'status', 'average_rating', 'total_reviews', 'created_at']
    list_filter = ['status', 'city', 'price_range', 'created_at']
    search_fields = ['name', 'owner__email', 'city']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['-created_at']


@admin.register(RestaurantImage)
class RestaurantImageAdmin(admin.ModelAdmin):
    list_display = ['restaurant', 'caption', 'order', 'created_at']
    list_filter = ['restaurant', 'created_at']
    ordering = ['order', '-created_at']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['restaurant', 'user', 'rating', 'is_verified_purchase', 'created_at']
    list_filter = ['rating', 'is_verified_purchase', 'created_at']
    search_fields = ['restaurant__name', 'user__email', 'comment']
    ordering = ['-created_at']


@admin.register(Table)
class TableAdmin(admin.ModelAdmin):
    list_display = ['restaurant', 'table_number', 'capacity', 'location', 'is_available']
    list_filter = ['restaurant', 'is_available', 'location']
    search_fields = ['restaurant__name', 'table_number']

