from django.contrib import admin
from analytics.models import DailySalesReport, RevenueTrend, PopularItem


@admin.register(DailySalesReport)
class DailySalesReportAdmin(admin.ModelAdmin):
    list_display = ['restaurant', 'date', 'total_orders', 'gross_revenue', 'net_revenue', 'unique_customers']
    list_filter = ['date', 'restaurant']
    search_fields = ['restaurant__name']
    ordering = ['-date']


@admin.register(RevenueTrend)
class RevenueTrendAdmin(admin.ModelAdmin):
    list_display = ['restaurant', 'period', 'start_date', 'end_date', 'revenue', 'order_count']
    list_filter = ['period', 'restaurant']
    ordering = ['-start_date']


@admin.register(PopularItem)
class PopularItemAdmin(admin.ModelAdmin):
    list_display = ['menu_item', 'restaurant', 'order_count', 'revenue_generated', 'period_start', 'period_end']
    list_filter = ['restaurant', 'period_start']
    ordering = ['-order_count']

