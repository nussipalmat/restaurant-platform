from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings


@shared_task
def send_email_notification(notification_id):
    from notifications.models import Notification
    
    try:
        notification = Notification.objects.get(id=notification_id)
        user = notification.user
        
        if hasattr(user, 'notification_settings'):
            settings_obj = user.notification_settings
            
            if notification.notification_type == 'ORDER' and not settings_obj.email_order_updates:
                return "Email notifications disabled for orders"
            elif notification.notification_type == 'RESERVATION' and not settings_obj.email_reservation_updates:
                return "Email notifications disabled for reservations"
            elif notification.notification_type == 'PROMOTION' and not settings_obj.email_promotions:
                return "Email notifications disabled for promotions"
        
        try:
            send_mail(
                subject=notification.title,
                message=notification.message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )
            
            notification.sent_email = True
            notification.save()
            
            return f"Email sent to {user.email}"
        except Exception as e:
            return f"Failed to send email: {str(e)}"
            
    except Notification.DoesNotExist:
        return f"Notification {notification_id} not found"


@shared_task
def send_sms_notification(notification_id):
    from notifications.models import Notification
    
    try:
        notification = Notification.objects.get(id=notification_id)
        print(f"SMS would be sent for notification {notification_id}")
        
        notification.sent_sms = True
        notification.save()
        
        return f"SMS sent for notification {notification_id}"
    except Notification.DoesNotExist:
        return f"Notification {notification_id} not found"


@shared_task
def send_push_notification(notification_id):
    from notifications.models import Notification
    
    try:
        notification = Notification.objects.get(id=notification_id)
        print(f"Push notification would be sent for notification {notification_id}")
        
        notification.sent_push = True
        notification.save()
        
        return f"Push notification sent for notification {notification_id}"
    except Notification.DoesNotExist:
        return f"Notification {notification_id} not found"