from django.urls import path, include
from rest_framework.routers import DefaultRouter
from restaurants import views

router = DefaultRouter()
router.register(r'tables', views.TableViewSet, basename='table')
router.register(r'', views.RestaurantViewSet, basename='restaurant')

urlpatterns = [
    path('', include(router.urls)),
]
