import uuid
from django.db import models
from django.utils import timezone
from users.models import User

class SupportTicket(models.Model):
    STATUS_CHOICES = [
        ('OPEN', 'Open'),
        ('IN_PROGRESS', 'In Progress'),
        ('WAITING_CUSTOMER', 'Waiting for Customer'),
        ('RESOLVED', 'Resolved'),
        ('CLOSED', 'Closed'),
    ]
    
    PRIORITY_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('URGENT', 'Urgent'),
    ]
    
    CATEGORY_CHOICES = [
        ('ORDER', 'Order Issue'),
        ('PAYMENT', 'Payment Issue'),
        ('RESERVATION', 'Reservation Issue'),
        ('ACCOUNT', 'Account Issue'),
        ('TECHNICAL', 'Technical Issue'),
        ('FEEDBACK', 'Feedback'),
        ('OTHER', 'Other'),
    ]
    
    ticket_number = models.CharField(max_length=50, unique=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='support_tickets')
    
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    subject = models.CharField(max_length=200)
    description = models.TextField()
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='OPEN')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='MEDIUM')
    
    assigned_to = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='assigned_tickets'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'support_tickets'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Ticket {self.ticket_number} - {self.subject}"
    
    def save(self, *args, **kwargs):
        if not self.ticket_number:
            self.ticket_number = f"TKT-{timezone.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

class TicketComment(models.Model):
    ticket = models.ForeignKey(SupportTicket, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    comment = models.TextField()
    is_staff_response = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ticket_comments'
        ordering = ['created_at']
    
    def __str__(self):
        return f"Comment on {self.ticket.ticket_number} by {self.user.email}"