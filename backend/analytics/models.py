from django.db import models
from django.core.validators import MinValueValidator
from restaurants.models import Restaurant


class DailySalesReport(models.Model):
    
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='daily_reports')
    date = models.DateField()
    
    total_orders = models.IntegerField(default=0)
    completed_orders = models.IntegerField(default=0)
    cancelled_orders = models.IntegerField(default=0)
    
    gross_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    net_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    tax_collected = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    delivery_fees = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    discounts_given = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    
    average_order_value = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    
    unique_customers = models.IntegerField(default=0)
    new_customers = models.IntegerField(default=0)
    returning_customers = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'daily_sales_reports'
        ordering = ['-date']
        unique_together = ['restaurant', 'date']
    
    def __str__(self):
        return f"{self.restaurant.name} - {self.date}"


class RevenueTrend(models.Model):
    
    PERIOD_CHOICES = [
        ('DAILY', 'Daily'),
        ('WEEKLY', 'Weekly'),
        ('MONTHLY', 'Monthly'),
        ('YEARLY', 'Yearly'),
    ]
    
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='revenue_trends')
    period = models.CharField(max_length=10, choices=PERIOD_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField()
    
    revenue = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    order_count = models.IntegerField(default=0)
    customer_count = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'revenue_trends'
        ordering = ['-start_date']
    
    def __str__(self):
        return f"{self.restaurant.name} - {self.period} ({self.start_date} to {self.end_date})"


class PopularItem(models.Model):
    
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='popular_items')
    menu_item = models.ForeignKey('menu.MenuItem', on_delete=models.CASCADE)
    
    period_start = models.DateField()
    period_end = models.DateField()
    
    order_count = models.IntegerField(default=0)
    revenue_generated = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'popular_items'
        ordering = ['-order_count']
    
    def __str__(self):
        return f"{self.menu_item.name} - {self.order_count} orders"

