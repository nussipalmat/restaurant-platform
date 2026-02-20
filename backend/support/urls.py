from django.urls import path, include
from rest_framework.routers import DefaultRouter
from support import views

router = DefaultRouter()
router.register(r'tickets', views.SupportTicketViewSet, basename='support-ticket')

urlpatterns = [
    path('', include(router.urls)),
]
