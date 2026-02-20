from django.db import models
from django.core.validators import MinValueValidator
from restaurants.models import Restaurant
from users.models import User


class InventoryItem(models.Model):
    UNIT_CHOICES = [
        ('KG', 'Kilogram'),
        ('G', 'Gram'),
        ('L', 'Liter'),
        ('ML', 'Milliliter'),
        ('PIECE', 'Piece'),
        ('BOX', 'Box'),
        ('PACK', 'Pack'),
    ]
    
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='inventory_items')
    name = models.CharField(max_length=200)
    sku = models.CharField(max_length=50, blank=True)
    category = models.CharField(max_length=100)
    
    current_quantity = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    minimum_quantity = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    unit = models.CharField(max_length=10, choices=UNIT_CHOICES, default='PIECE')
    
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    
    supplier_name = models.CharField(max_length=200, blank=True)
    supplier_contact = models.CharField(max_length=100, blank=True)
    
    last_restocked = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'inventory_items'
        ordering = ['name']
        unique_together = ['restaurant', 'name']
    
    def __str__(self):
        return f"{self.restaurant.name} - {self.name}"
    
    @property
    def is_low_stock(self):
        return self.current_quantity <= self.minimum_quantity


class StockMovement(models.Model):
    MOVEMENT_TYPE_CHOICES = [
        ('RESTOCK', 'Restock'),
        ('USAGE', 'Usage'),
        ('ADJUSTMENT', 'Adjustment'),
        ('WASTE', 'Waste'),
    ]
    
    inventory_item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE, related_name='movements')
    movement_type = models.CharField(max_length=20, choices=MOVEMENT_TYPE_CHOICES)
    
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    previous_quantity = models.DecimalField(max_digits=10, decimal_places=2)
    new_quantity = models.DecimalField(max_digits=10, decimal_places=2)
    
    notes = models.TextField(blank=True)
    performed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'stock_movements'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.inventory_item.name} - {self.movement_type} ({self.quantity})"