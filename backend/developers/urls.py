from django.urls import path, include
from rest_framework.routers import DefaultRouter
from developers import views

router = DefaultRouter()
router.register(r'api-keys', views.APIKeyViewSet, basename='api-key')
router.register(r'webhooks', views.WebhookViewSet, basename='webhook')

urlpatterns = [
    path('', include(router.urls)),
]
