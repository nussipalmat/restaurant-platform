from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from developers.models import APIKey, Webhook
from developers.serializers.developer_serializers import APIKeySerializer, WebhookSerializer


class APIKeyViewSet(viewsets.ModelViewSet):
    queryset = APIKey.objects.all()
    serializer_class = APIKeySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return APIKey.objects.filter(user=self.request.user)


class WebhookViewSet(viewsets.ModelViewSet):
    queryset = Webhook.objects.all()
    serializer_class = WebhookSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Webhook.objects.filter(user=self.request.user)


