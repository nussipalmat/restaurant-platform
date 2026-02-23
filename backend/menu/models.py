from django.db import models
from django.core.validators import MinValueValidator
from restaurants.models import Restaurant


class MenuCategory(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='menu_categories')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'menu_categories'
        ordering = ['order', 'name']
        verbose_name_plural = 'Menu Categories'
        unique_together = ['restaurant', 'name']
    
    def __str__(self):
        return f"{self.restaurant.name} - {self.name}"


class MenuItem(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='menu_items')
    category = models.ForeignKey(MenuCategory, on_delete=models.CASCADE, related_name='items')
    
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=8, decimal_places=2, validators=[MinValueValidator(0.01)])
    
    image = models.ImageField(upload_to='menu/items/', blank=True, null=True)
    
    calories = models.IntegerField(blank=True, null=True)
    allergens = models.JSONField(default=list, blank=True)
    
    is_available = models.BooleanField(default=True)
    is_vegetarian = models.BooleanField(default=False)
    is_vegan = models.BooleanField(default=False)
    is_gluten_free = models.BooleanField(default=False)
    
    order_count = models.IntegerField(default=0)
    
    recipe = models.JSONField(default=dict, blank=True)
    
    preparation_time = models.IntegerField(default=15, help_text="In minutes")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'menu_items'
        ordering = ['category', 'name']
    
    def __str__(self):
        return f"{self.restaurant.name} - {self.name}"