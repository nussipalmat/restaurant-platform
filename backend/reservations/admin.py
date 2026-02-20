from django.contrib import admin
from reservations.models import Reservation


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ['user', 'restaurant', 'reservation_date', 'reservation_time', 'guests_count', 'status']
    list_filter = ['status', 'reservation_date', 'created_at']
    search_fields = ['user__email', 'restaurant__name', 'phone', 'email']
    ordering = ['-reservation_date', '-reservation_time']

