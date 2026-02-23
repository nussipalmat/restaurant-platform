from django.urls import path, include
from rest_framework.routers import DefaultRouter
from analytics import views

router = DefaultRouter()
router.register(r'reports', views.DailySalesReportViewSet, basename='sales-report')

urlpatterns = [
    path('', include(router.urls)),
]
