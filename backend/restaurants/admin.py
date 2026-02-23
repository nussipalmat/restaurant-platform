from django.contrib import admin
from restaurants.models import Restaurant, RestaurantImage, Review, Table

class RoleBasedAdmin(admin.ModelAdmin):
    def has_module_permission(self, request):
        return request.user.is_authenticated and request.user.role in ['ADMIN', 'RESTAURANT_OWNER']

@admin.register(Restaurant)
class RestaurantAdmin(RoleBasedAdmin):
    list_display = ['name', 'owner', 'city', 'status', 'average_rating', 'total_reviews', 'created_at']
    list_filter = ['status', 'city', 'created_at'] 
    search_fields = ['name', 'owner__email', 'city']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['-created_at']

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.role == 'ADMIN':
            return qs 
        if request.user.role == 'RESTAURANT_OWNER':
            return qs.filter(owner=request.user) 
        return qs.none()

    def get_readonly_fields(self, request, obj=None):
        if request.user.role == 'RESTAURANT_OWNER':
            return ['owner', 'average_rating', 'total_reviews']
        return []

    def save_model(self, request, obj, form, change):
        if not change and request.user.role == 'RESTAURANT_OWNER':
            obj.owner = request.user
        super().save_model(request, obj, form, change)


@admin.register(RestaurantImage)
class RestaurantImageAdmin(RoleBasedAdmin):
    list_display = ['restaurant', 'caption', 'order', 'created_at']
    list_filter = ['created_at']
    ordering = ['order', '-created_at']

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.role == 'ADMIN':
            return qs
        if request.user.role == 'RESTAURANT_OWNER':
            return qs.filter(restaurant__owner=request.user)
        return qs.none()

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "restaurant" and request.user.role == 'RESTAURANT_OWNER':
            kwargs["queryset"] = Restaurant.objects.filter(owner=request.user)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


@admin.register(Review)
class ReviewAdmin(RoleBasedAdmin):
    list_display = ['restaurant', 'user', 'rating', 'is_verified_purchase', 'created_at']
    list_filter = ['rating', 'is_verified_purchase', 'created_at']
    search_fields = ['restaurant__name', 'user__email', 'comment']
    ordering = ['-created_at']

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.role == 'ADMIN':
            return qs
        if request.user.role == 'RESTAURANT_OWNER':
            return qs.filter(restaurant__owner=request.user)
        return qs.none()
        
    def get_readonly_fields(self, request, obj=None):
        if request.user.role == 'RESTAURANT_OWNER':
            return ['restaurant', 'user', 'rating', 'comment', 'is_verified_purchase']
        return []


@admin.register(Table)
class TableAdmin(RoleBasedAdmin):
    list_display = ['restaurant', 'table_number', 'capacity', 'location', 'is_available']
    list_filter = ['is_available', 'location']
    search_fields = ['restaurant__name', 'table_number']

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.role == 'ADMIN':
            return qs
        if request.user.role == 'RESTAURANT_OWNER':
            return qs.filter(restaurant__owner=request.user)
        return qs.none()

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "restaurant" and request.user.role == 'RESTAURANT_OWNER':
            kwargs["queryset"] = Restaurant.objects.filter(owner=request.user)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)