from django.contrib import admin
from inventory.models import InventoryItem, StockMovement


@admin.register(InventoryItem)
class InventoryItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'restaurant', 'current_quantity', 'minimum_quantity', 'unit', 'is_low_stock']
    list_filter = ['restaurant', 'category', 'unit']
    search_fields = ['name', 'restaurant__name', 'sku']
    ordering = ['name']
    
    def is_low_stock(self, obj):
        return obj.is_low_stock
    is_low_stock.boolean = True


@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ['inventory_item', 'movement_type', 'quantity', 'previous_quantity', 'new_quantity', 'created_at']
    list_filter = ['movement_type', 'created_at']
    search_fields = ['inventory_item__name', 'notes']
    ordering = ['-created_at']

