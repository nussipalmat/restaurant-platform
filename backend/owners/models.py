from django.db import models

class OwnerProfile(models.Model):
    # Fields for the OwnerProfile model
    username = models.CharField(max_length=255)
    email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)

class OwnerSupportTicket(models.Model):
    # Fields for the OwnerSupportTicket model
    owner = models.ForeignKey(OwnerProfile, on_delete=models.CASCADE)
    subject = models.CharField(max_length=255)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class OwnerTicketComment(models.Model):
    # Fields for the OwnerTicketComment model
    ticket = models.ForeignKey(OwnerSupportTicket, on_delete=models.CASCADE)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)