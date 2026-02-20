from celery import shared_task
from django.db import models


@shared_task
def check_low_stock_alerts():
    from inventory.models import InventoryItem
    
    low_stock_items = InventoryItem.objects.filter(
        current_quantity__lte=models.F('minimum_quantity')
    )
    
    alerts_sent = 0
    for item in low_stock_items:
        print(f"LOW STOCK ALERT: {item.restaurant.name} - {item.name} ({item.current_quantity} {item.unit})")
        alerts_sent += 1
    
    return f"Sent {alerts_sent} low stock alerts"


@shared_task
def track_stock_usage(order_id):
    from orders.models import Order
    from inventory.models import InventoryItem, StockMovement
    
    try:
        order = Order.objects.get(id=order_id)
        
        for order_item in order.items.all():
            menu_item = order_item.menu_item
            
            if menu_item.recipe:
                for ingredient_id, quantity_needed in menu_item.recipe.items():
                    try:
                        inventory_item = InventoryItem.objects.get(
                            id=ingredient_id,
                            restaurant=order.restaurant
                        )
                        
                        previous_qty = inventory_item.current_quantity
                        inventory_item.current_quantity -= (quantity_needed * order_item.quantity)
                        inventory_item.save()
                        
                        StockMovement.objects.create(
                            inventory_item=inventory_item,
                            movement_type='USAGE',
                            quantity=-(quantity_needed * order_item.quantity),
                            previous_quantity=previous_qty,
                            new_quantity=inventory_item.current_quantity,
                            notes=f"Used for order {order.order_number}",
                            performed_by=order.user
                        )
                        
                    except InventoryItem.DoesNotExist:
                        print(f"Inventory item {ingredient_id} not found")
        
        return f"Stock tracked for order {order.order_number}"
    except Order.DoesNotExist:
        return f"Order {order_id} not found"