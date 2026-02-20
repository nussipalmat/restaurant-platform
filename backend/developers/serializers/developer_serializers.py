from rest_framework import serializers
from developers.models import APIKey, Webhook, APIUsageLog


class APIKeySerializer(serializers.ModelSerializer):
    class Meta:
        model = APIKey
        fields = '__all__'
        read_only_fields = ['key', 'user', 'total_requests', 'last_used']


class WebhookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Webhook
        fields = '__all__'
        read_only_fields = ['secret', 'user', 'total_deliveries', 'failed_deliveries', 'last_delivery']


class APIUsageLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = APIUsageLog
        fields = '__all__'
