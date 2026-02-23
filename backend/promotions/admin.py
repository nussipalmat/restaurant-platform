from django.contrib import admin
from promotions.models import Promotion


@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'promotion_type', 'is_active', 'usage_count', 'start_date', 'end_date']
    list_filter = ['promotion_type', 'is_active', 'start_date', 'end_date']
    search_fields = ['code', 'name', 'description']
    ordering = ['-created_at']

