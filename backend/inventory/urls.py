from django.urls import path, include
from rest_framework.routers import DefaultRouter
from inventory import views

router = DefaultRouter()
router.register(r'items', views.InventoryItemViewSet, basename='inventory-item')
router.register(r'movements', views.StockMovementViewSet, basename='stock-movement')

urlpatterns = [
    path('', include(router.urls)),
]
