"""Serializers for promotions app."""
from rest_framework import serializers
from promotions.models import Promotion


class PromotionSerializer(serializers.ModelSerializer):
    is_valid = serializers.ReadOnlyField()
    
    class Meta:
        model = Promotion
        fields = '__all__'
