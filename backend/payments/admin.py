from django.contrib import admin
from payments.models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'user', 'amount', 'payment_method', 'status', 'created_at']
    list_filter = ['payment_method', 'status', 'created_at']
    search_fields = ['order__order_number', 'user__email', 'stripe_payment_intent_id']
    readonly_fields = ['stripe_payment_intent_id', 'stripe_charge_id', 'client_secret']
    ordering = ['-created_at']

