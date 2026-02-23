from django.urls import path, include
from rest_framework.routers import DefaultRouter
from payments import views

router = DefaultRouter()
router.register(r'', views.PaymentViewSet, basename='payment')

urlpatterns = [
    path('webhooks/stripe/', views.StripeWebhookView.as_view(), name='stripe-webhook'),
    path('', include(router.urls)),
]
