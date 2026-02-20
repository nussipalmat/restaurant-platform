from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from support.models import SupportTicket, TicketComment
from notifications.models import Notification


@receiver(pre_save, sender=SupportTicket)
def store_previous_ticket_status(sender, instance, **kwargs):
    if instance.pk:
        try:
            instance._previous_status = SupportTicket.objects.get(pk=instance.pk).status
        except SupportTicket.DoesNotExist:
            instance._previous_status = None
    else:
        instance._previous_status = None


@receiver(post_save, sender=SupportTicket)
def create_ticket_notification(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            user=instance.user,
            notification_type='SYSTEM',
            title='Support Ticket Created',
            message=(
                f'Your support ticket #{instance.ticket_number} has been created. '
                f'We will respond shortly.'
            ),
        )
    else:
        previous_status = getattr(instance, '_previous_status', None)
        if previous_status == instance.status:
            return

        if instance.status == 'IN_PROGRESS':
            Notification.objects.create(
                user=instance.user,
                notification_type='SYSTEM',
                title='Ticket In Progress',
                message=f'Your support ticket #{instance.ticket_number} is being worked on.',
            )
        elif instance.status == 'RESOLVED':
            Notification.objects.create(
                user=instance.user,
                notification_type='SYSTEM',
                title='Ticket Resolved',
                message=f'Your support ticket #{instance.ticket_number} has been resolved.',
            )


@receiver(post_save, sender=TicketComment)
def create_comment_notification(sender, instance, created, **kwargs):
    if created and instance.user != instance.ticket.user:
        Notification.objects.create(
            user=instance.ticket.user,
            notification_type='SYSTEM',
            title='New Response on Your Ticket',
            message=(
                f'You have a new response on support ticket '
                f'#{instance.ticket.ticket_number}.'
            ),
        )