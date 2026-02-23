from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from reservations.models import Reservation
from notifications.models import Notification


@receiver(pre_save, sender=Reservation)
def store_previous_status(sender, instance, **kwargs):
    if instance.pk:
        try:
            instance._previous_status = Reservation.objects.get(pk=instance.pk).status
        except Reservation.DoesNotExist:
            instance._previous_status = None
    else:
        instance._previous_status = None


@receiver(post_save, sender=Reservation)
def create_reservation_notification(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            user=instance.user,
            notification_type='RESERVATION',
            title='Reservation Submitted',
            message=(
                f'Your table reservation at {instance.restaurant.name} for '
                f'{instance.guests_count} guests on {instance.reservation_date} '
                f'at {instance.reservation_time} has been submitted.'
            ),
        )
    else:
        previous_status = getattr(instance, '_previous_status', None)
        if previous_status == instance.status:
            return

        if instance.status == 'CONFIRMED':
            Notification.objects.create(
                user=instance.user,
                notification_type='RESERVATION',
                title='Reservation Confirmed',
                message=f'Your reservation at {instance.restaurant.name} has been confirmed.',
            )
        elif instance.status == 'CANCELLED':
            Notification.objects.create(
                user=instance.user,
                notification_type='RESERVATION',
                title='Reservation Cancelled',
                message=(
                    f'Your reservation at {instance.restaurant.name} on '
                    f'{instance.reservation_date} has been cancelled.'
                ),
            )
        elif instance.status == 'NO_SHOW':
            Notification.objects.create(
                user=instance.user,
                notification_type='RESERVATION',
                title='Reservation No-Show',
                message=f'You did not show up for your reservation at {instance.restaurant.name}.',
            )