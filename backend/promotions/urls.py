from django.urls import path, include
from rest_framework.routers import DefaultRouter
from promotions import views

router = DefaultRouter()
router.register(r'', views.PromotionViewSet, basename='promotion')

urlpatterns = [
    path('', include(router.urls)),
]
