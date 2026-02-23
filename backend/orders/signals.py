from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.utils import timezone

from .models import Order
from payments.models import Payment
from notifications.models import Notification


@receiver(post_save, sender=Order)
def create_order_notification(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            user=instance.user,
            notification_type='ORDER',
            title='Order Placed Successfully',
            message=f'Your order #{instance.order_number} has been placed at {instance.restaurant.name}. Total: ${instance.total}',
        )
    else:
        if instance.status == 'CONFIRMED':
            Notification.objects.create(
                user=instance.user,
                notification_type='ORDER',
                title='Order Confirmed',
                message=f'Your order #{instance.order_number} has been confirmed by {instance.restaurant.name}.',
            )
        elif instance.status == 'OUT_FOR_DELIVERY':
            Notification.objects.create(
                user=instance.user,
                notification_type='ORDER',
                title='Order Out for Delivery',
                message=f'Your order #{instance.order_number} is on its way!',
            )
        elif instance.status == 'DELIVERED':
            Notification.objects.create(
                user=instance.user,
                notification_type='ORDER',
                title='Order Delivered',
                message=f'Your order #{instance.order_number} has been delivered. Enjoy your meal!',
            )


@receiver(pre_save, sender=Order)
def auto_confirm_cash_payment_on_delivery(sender, instance, **kwargs):
    if instance.pk:
        try:
            old_order = Order.objects.get(pk=instance.pk)
            
            if old_order.status != 'DELIVERED' and instance.status == 'DELIVERED':
                
                if not instance.is_paid:
                    
                    try:
                        payment = Payment.objects.get(
                            order=instance,
                            payment_method='CASH',
                            status='PENDING'
                        )
                        
                        payment.status = 'SUCCEEDED'
                        payment.paid_at = timezone.now()
                        payment.save()
                        
                        instance.is_paid = True
                        instance.delivered_at = timezone.now()
                        
                        Notification.objects.create(
                            user=instance.user,
                            title='Заказ доставлен',
                            message=f'Ваш заказ {instance.order_number} успешно доставлен и оплачен. Приятного аппетита!',
                            is_read=False
                        )
                        
                        print(f"✅ Автоподтверждение оплаты наличными для заказа {instance.order_number}")
                        
                    except Payment.DoesNotExist:
                        pass
                        
        except Order.DoesNotExist:
            pass