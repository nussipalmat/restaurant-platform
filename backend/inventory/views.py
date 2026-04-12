from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from inventory.models import InventoryItem, StockMovement
from inventory.serializers.inventory_serializers import InventoryItemSerializer, StockMovementSerializer


class InventoryItemViewSet(viewsets.ModelViewSet):
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = InventoryItem.objects.select_related('restaurant').all()
        restaurant_id = self.request.query_params.get('restaurant')
        if restaurant_id:
            queryset = queryset.filter(restaurant_id=restaurant_id)

        user = self.request.user
        if user.role == 'RESTAURANT_OWNER':
            queryset = queryset.filter(restaurant__owner=user)
        elif user.role == 'CUSTOMER':
            queryset = queryset.none()

        return queryset


class StockMovementViewSet(viewsets.ModelViewSet):
    queryset = StockMovement.objects.all()
    serializer_class = StockMovementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = StockMovement.objects.select_related('inventory_item', 'inventory_item__restaurant').all()
        restaurant_id = self.request.query_params.get('restaurant')
        if restaurant_id:
            queryset = queryset.filter(inventory_item__restaurant_id=restaurant_id)

        user = self.request.user
        if user.role == 'RESTAURANT_OWNER':
            queryset = queryset.filter(inventory_item__restaurant__owner=user)
        elif user.role == 'CUSTOMER':
            queryset = queryset.none()

        return queryset
