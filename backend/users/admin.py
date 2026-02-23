from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from users.models import User, Address, UserProfile


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'username', 'role', 'is_email_verified', 'is_active', 'created_at']
    list_filter = ['role', 'is_email_verified', 'is_active', 'created_at']
    search_fields = ['email', 'username', 'first_name', 'last_name']
    ordering = ['-created_at']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('phone', 'role', 'is_email_verified', 'profile_image', 'date_of_birth')}),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Custom Fields', {'fields': ('email', 'phone', 'role')}),
    )


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ['user', 'address_type', 'city', 'state', 'is_default', 'created_at']
    list_filter = ['address_type', 'is_default', 'city', 'state']
    search_fields = ['user__email', 'street_address', 'city']
    ordering = ['-created_at']


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'loyalty_points']
    search_fields = ['user__email']

