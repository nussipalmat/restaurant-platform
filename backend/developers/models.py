from django.db import models
from django.utils.crypto import get_random_string
from users.models import User


class APIKey(models.Model):
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='api_keys')
    name = models.CharField(max_length=200)
    key = models.CharField(max_length=64, unique=True, editable=False)
    
    is_active = models.BooleanField(default=True)
    
    rate_limit = models.IntegerField(default=1000, help_text="Requests per hour")
    
    total_requests = models.IntegerField(default=0)
    last_used = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'api_keys'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.name}"
    
    def save(self, *args, **kwargs):
        if not self.key:
            self.key = get_random_string(64)
        super().save(*args, **kwargs)


class Webhook(models.Model):
    
    EVENT_CHOICES = [
        ('ORDER_CREATED', 'Order Created'),
        ('ORDER_UPDATED', 'Order Updated'),
        ('PAYMENT_SUCCEEDED', 'Payment Succeeded'),
        ('PAYMENT_FAILED', 'Payment Failed'),
        ('RESERVATION_CREATED', 'Reservation Created'),
        ('RESERVATION_CANCELLED', 'Reservation Cancelled'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='webhooks')
    name = models.CharField(max_length=200)
    url = models.URLField()
    
    events = models.JSONField(default=list) 
    
    is_active = models.BooleanField(default=True)
    secret = models.CharField(max_length=64, editable=False)
    
    total_deliveries = models.IntegerField(default=0)
    failed_deliveries = models.IntegerField(default=0)
    last_delivery = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'webhooks'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.name}"
    
    def save(self, *args, **kwargs):
        if not self.secret:
            self.secret = get_random_string(64)
        super().save(*args, **kwargs)


class APIUsageLog(models.Model):
    
    api_key = models.ForeignKey(APIKey, on_delete=models.CASCADE, related_name='usage_logs')
    
    endpoint = models.CharField(max_length=255)
    method = models.CharField(max_length=10)
    
    status_code = models.IntegerField()
    response_time = models.IntegerField(help_text="Response time in milliseconds")
    
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'api_usage_logs'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['api_key', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.api_key.name} - {self.method} {self.endpoint}"

