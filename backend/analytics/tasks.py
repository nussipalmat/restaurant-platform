from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from django.db.models import Sum, Count, Avg


@shared_task
def generate_daily_reports():
   
    from analytics.models import DailySalesReport
    from restaurants.models import Restaurant
    from orders.models import Order
    
    yesterday = (timezone.now() - timedelta(days=1)).date()
    reports_generated = 0
    
    for restaurant in Restaurant.objects.filter(status='ACTIVE'):
        
        orders = Order.objects.filter(
            restaurant=restaurant,
            created_at__date=yesterday
        )
        
        completed_orders = orders.filter(status='DELIVERED')
        cancelled_orders = orders.filter(status='CANCELLED')
        
        gross_revenue = completed_orders.aggregate(Sum('total'))['total__sum'] or 0
        tax_collected = completed_orders.aggregate(Sum('tax'))['tax__sum'] or 0
        delivery_fees = completed_orders.aggregate(Sum('delivery_fee'))['delivery_fee__sum'] or 0
        discounts_given = completed_orders.aggregate(Sum('discount'))['discount__sum'] or 0
        
        net_revenue = gross_revenue - discounts_given
        
        
        avg_order_value = completed_orders.aggregate(Avg('total'))['total__avg'] or 0
        
        
        unique_customers = orders.values('user').distinct().count()
        
        report, created = DailySalesReport.objects.update_or_create(
            restaurant=restaurant,
            date=yesterday,
            defaults={
                'total_orders': orders.count(),
                'completed_orders': completed_orders.count(),
                'cancelled_orders': cancelled_orders.count(),
                'gross_revenue': gross_revenue,
                'net_revenue': net_revenue,
                'tax_collected': tax_collected,
                'delivery_fees': delivery_fees,
                'discounts_given': discounts_given,
                'average_order_value': avg_order_value,
                'unique_customers': unique_customers,
            }
        )
        
        reports_generated += 1
    
    return f"Generated {reports_generated} daily reports for {yesterday}"
