from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Restaurant Management API",
        default_version='v1',
        description="Complete API for restaurant management platform with ordering, reservations, payments, and more",
        terms_of_service="https://www.example.com/terms/",
        contact=openapi.Contact(email="contact@restaurant.local"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    path('api/v1/auth/', include('users.urls')),
    path('api/v1/restaurants/', include('restaurants.urls')),
    path('api/v1/menu/', include('menu.urls')),
    path('api/v1/orders/', include('orders.urls')),
    path('api/v1/reservations/', include('reservations.urls')),
    path('api/v1/payments/', include('payments.urls')),
    path('api/v1/inventory/', include('inventory.urls')),
    path('api/v1/notifications/', include('notifications.urls')),
    path('api/v1/support/', include('support.urls')),
    path('api/v1/promotions/', include('promotions.urls')),
    path('api/v1/analytics/', include('analytics.urls')),
    path('api/v1/developers/', include('developers.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)