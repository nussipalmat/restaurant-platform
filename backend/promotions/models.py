from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from restaurants.models import Restaurant


class Promotion(models.Model):
    
    TYPE_CHOICES = [
        ('PERCENTAGE', 'Percentage Discount'),
        ('FIXED', 'Fixed Amount Discount'),
        ('FREE_DELIVERY', 'Free Delivery'),
    ]
    
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=200)
    description = models.TextField()
    
    promotion_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    discount_percentage = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        null=True, 
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    discount_amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True, 
        blank=True,
        validators=[MinValueValidator(0)]
    )
    
    restaurant = models.ForeignKey(
        Restaurant, 
        on_delete=models.CASCADE, 
        related_name='promotions',
        null=True,
        blank=True,
        help_text="Leave blank for platform-wide promotions"
    )
    
    minimum_order_amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=0.0,
        validators=[MinValueValidator(0)]
    )
    maximum_discount = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True, 
        blank=True,
        validators=[MinValueValidator(0)]
    )
    
    usage_limit = models.IntegerField(null=True, blank=True, help_text="Total number of times this promo can be used")
    usage_limit_per_user = models.IntegerField(default=1, help_text="Number of times per user")
    usage_count = models.IntegerField(default=0)
    
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'promotions'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.code} - {self.name}"
    
    @property
    def is_valid(self):
        now = timezone.now()
        return (
            self.is_active and
            self.start_date <= now <= self.end_date and
            (self.usage_limit is None or self.usage_count < self.usage_limit)
        )