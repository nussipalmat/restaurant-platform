from celery import shared_task
from django.utils import timezone
from datetime import timedelta


@shared_task
def send_order_confirmation_email(order_id):
    from orders.models import Order
    try:
        order = Order.objects.get(id=order_id)
        print(f"Sending order confirmation email for order {order.order_number}")
        return f"Email sent for order {order.order_number}"
    except Order.DoesNotExist:
        return f"Order {order_id} not found"


@shared_task
def send_order_status_update(order_id):
    from orders.models import Order
    try:
        order = Order.objects.get(id=order_id)
        print(f"Sending status update for order {order.order_number}: {order.status}")
        return f"Status update sent for order {order.order_number}"
    except Order.DoesNotExist:
        return f"Order {order_id} not found"


@shared_task
def notify_restaurant_new_order(order_id):
    from orders.models import Order
    try:
        order = Order.objects.get(id=order_id)
        print(f"Notifying restaurant {order.restaurant.name} about order {order.order_number}")
        return f"Restaurant notified about order {order.order_number}"
    except Order.DoesNotExist:
        return f"Order {order_id} not found"


@shared_task
def auto_cancel_unpaid_orders():
    from orders.models import Order
    
    cutoff_time = timezone.now() - timedelta(minutes=30)
    unpaid_orders = Order.objects.filter(
        status='PENDING',
        is_paid=False,
        created_at__lt=cutoff_time
    )
    
    count = 0
    for order in unpaid_orders:
        order.status = 'CANCELLED'
        order.cancellation_reason = 'Automatically cancelled due to non-payment'
        order.cancelled_at = timezone.now()
        order.save()
        count += 1
        
        send_order_status_update.delay(order.id)
    
    return f"Auto-cancelled {count} unpaid orders"