from rest_framework import serializers
from inventory.models import InventoryItem, StockMovement


class InventoryItemSerializer(serializers.ModelSerializer):
    is_low_stock = serializers.ReadOnlyField()
    
    class Meta:
        model = InventoryItem
        fields = '__all__'


class StockMovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockMovement
        fields = '__all__'
        read_only_fields = ['performed_by']
