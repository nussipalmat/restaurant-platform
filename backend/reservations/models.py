from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from django.utils import timezone
from users.models import User
from restaurants.models import Restaurant, Table


class Reservation(models.Model):
    
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('SEATED', 'Seated'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
        ('NO_SHOW', 'No Show'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reservations')
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='reservations')
    table = models.ForeignKey(Table, on_delete=models.CASCADE, related_name='reservations')
    
    reservation_date = models.DateField()
    reservation_time = models.TimeField()
    guests_count = models.IntegerField(validators=[MinValueValidator(1)])
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    
    special_requests = models.TextField(blank=True)
    
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    
    cancellation_reason = models.TextField(blank=True)
    
    class Meta:
        db_table = 'reservations'
        ordering = ['-reservation_date', '-reservation_time']
    
    def __str__(self):
        return f"{self.user.email} - {self.restaurant.name} on {self.reservation_date} at {self.reservation_time}"
    
    def clean(self):
        if self.reservation_date < timezone.now().date():
            raise ValidationError("Reservation date cannot be in the past")
        
        if self.table and self.guests_count > self.table.capacity:
            raise ValidationError(f"Table capacity is {self.table.capacity}, requested {self.guests_count} guests")
    
    @property
    def is_past(self):
        reservation_datetime = timezone.make_aware(
            timezone.datetime.combine(self.reservation_date, self.reservation_time)
        )
        return reservation_datetime < timezone.now()