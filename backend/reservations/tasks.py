from celery import shared_task
from django.utils import timezone
from datetime import timedelta


@shared_task
def send_reservation_reminder(reservation_id):
    from reservations.models import Reservation
    try:
        reservation = Reservation.objects.get(id=reservation_id)
        print(f"Sending reminder for reservation at {reservation.restaurant.name} on {reservation.reservation_date}")
        return f"Reminder sent for reservation {reservation.id}"
    except Reservation.DoesNotExist:
        return f"Reservation {reservation_id} not found"


@shared_task
def mark_no_show_reservations():
    from reservations.models import Reservation
    
    cutoff_time = timezone.now() - timedelta(minutes=30)
    start_time = timezone.now() - timedelta(hours=24)
    
    no_show_count = 0
    confirmed_reservations = Reservation.objects.filter(
        status='CONFIRMED',
        reservation_date__gte=start_time.date()
    )
    
    for reservation in confirmed_reservations:
        reservation_datetime = timezone.make_aware(
            timezone.datetime.combine(reservation.reservation_date, reservation.reservation_time)
        )
        
        if reservation_datetime < cutoff_time:
            reservation.status = 'NO_SHOW'
            reservation.save()
            no_show_count += 1
            
            print(f"Marked reservation {reservation.id} as NO_SHOW")
    
    return f"Marked {no_show_count} reservations as NO_SHOW"