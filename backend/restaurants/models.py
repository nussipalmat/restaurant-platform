from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from users.models import User

class Restaurant(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending Approval'),
        ('ACTIVE', 'Active'),
        ('INACTIVE', 'Inactive'),
        ('SUSPENDED', 'Suspended'),
    ]
    
    PRICE_RANGE_CHOICES = [
        ('$', 'Budget'),
        ('$$', 'Moderate'),
        ('$$$', 'Expensive'),
        ('$$$$', 'Very Expensive'),
    ]
    
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='restaurants')
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True)
    description = models.TextField()
    cuisine_type = models.JSONField(default=list)
    price_range = models.CharField(max_length=5, choices=PRICE_RANGE_CHOICES, default='$$')
    
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    website = models.URLField(blank=True)
    
    street_address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default='USA')
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    
    business_hours = models.JSONField(default=dict)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    is_accepting_orders = models.BooleanField(default=True)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    total_reviews = models.IntegerField(default=0)
    
    features = models.JSONField(default=list)
    
    logo = models.ImageField(upload_to='restaurants/logos/', blank=True, null=True)
    cover_image = models.ImageField(upload_to='restaurants/covers/', blank=True, null=True)
    
    delivery_fee = models.DecimalField(max_digits=6, decimal_places=2, default=0.0)
    minimum_order = models.DecimalField(max_digits=8, decimal_places=2, default=0.0)
    estimated_delivery_time = models.IntegerField(default=30)
    tax_rate = models.DecimalField(max_digits=4, decimal_places=2, default=0.0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'restaurants'
        ordering = ['-average_rating', '-created_at']
    
    def __str__(self):
        return self.name
    
    def update_rating(self):
        reviews = self.reviews.all()
        if reviews.exists():
            self.total_reviews = reviews.count()
            self.average_rating = reviews.aggregate(models.Avg('rating'))['rating__avg']
            self.save()

class RestaurantImage(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='restaurants/gallery/')
    caption = models.CharField(max_length=200, blank=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'restaurant_images'
        ordering = ['order', '-created_at']
    
    def __str__(self):
        return f"{self.restaurant.name} - Image {self.id}"

class Review(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    order = models.ForeignKey('orders.Order', on_delete=models.SET_NULL, null=True, blank=True, related_name='review')
    
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    title = models.CharField(max_length=200, blank=True)
    comment = models.TextField()
    
    food_rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], null=True, blank=True)
    service_rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], null=True, blank=True)
    ambiance_rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], null=True, blank=True)
    
    is_verified_purchase = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'reviews'
        ordering = ['-created_at']
        unique_together = ['restaurant', 'user', 'order']
    
    def __str__(self):
        return f"{self.user.email} - {self.restaurant.name} ({self.rating}★)"
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.restaurant.update_rating()

class Table(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='tables')
    table_number = models.CharField(max_length=20)
    capacity = models.IntegerField(validators=[MinValueValidator(1)])
    is_available = models.BooleanField(default=True)
    location = models.CharField(max_length=50, blank=True)
    
    class Meta:
        db_table = 'restaurant_tables'
        unique_together = ['restaurant', 'table_number']
        ordering = ['table_number']
    
    def __str__(self):
        return f"{self.restaurant.name} - Table {self.table_number}"