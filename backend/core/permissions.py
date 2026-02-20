from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        return hasattr(obj, 'user') and obj.user == request.user


class IsRestaurantOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'RESTAURANT_OWNER'
    
    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'owner'):
            return obj.owner == request.user
        elif hasattr(obj, 'restaurant'):
            return obj.restaurant.owner == request.user
        return False


class IsRestaurantOwnerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role == 'RESTAURANT_OWNER'
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        if hasattr(obj, 'owner'):
            return obj.owner == request.user
        elif hasattr(obj, 'restaurant'):
            return obj.restaurant.owner == request.user
        return False


class IsRestaurantStaffOrOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        restaurant = None
        if hasattr(obj, 'restaurant'):
            restaurant = obj.restaurant
        elif hasattr(obj, 'owner'):
            restaurant = obj
        
        if not restaurant:
            return False
        
        if restaurant.owner == request.user:
            return True
        
        return False


class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'ADMIN'


class IsCustomer(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'CUSTOMER'


class IsAuthenticatedOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated