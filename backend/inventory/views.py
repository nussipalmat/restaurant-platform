from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from inventory.models import InventoryItem, StockMovement
from inventory.serializers.inventory_serializers import InventoryItemSerializer, StockMovementSerializer


class InventoryItemViewSet(viewsets.ModelViewSet):
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer
    permission_classes = [IsAuthenticated]


class StockMovementViewSet(viewsets.ModelViewSet):
    queryset = StockMovement.objects.all()
    serializer_class = StockMovementSerializer
    permission_classes = [IsAuthenticated]