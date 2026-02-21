from django.contrib import admin
from developers.models import APIKey, Webhook, APIUsageLog

class DevelopersRoleAdmin(admin.ModelAdmin):
    def has_module_permission(self, request):
        if request.user.is_superuser:
            return True
        return request.user.is_authenticated and request.user.role in ['ADMIN', 'STAFF']

@admin.register(APIKey)
class APIKeyAdmin(DevelopersRoleAdmin):
    list_display = ['name', 'user', 'is_active', 'rate_limit', 'total_requests', 'last_used', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'user__email', 'key']
    readonly_fields = ['key', 'total_requests', 'last_used']
    ordering = ['-created_at']

@admin.register(Webhook)
class WebhookAdmin(DevelopersRoleAdmin):
    list_display = ['name', 'user', 'url', 'is_active', 'total_deliveries', 'failed_deliveries']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'user__email', 'url']
    readonly_fields = ['secret', 'total_deliveries', 'failed_deliveries', 'last_delivery']
    ordering = ['-created_at']

@admin.register(APIUsageLog)
class APIUsageLogAdmin(DevelopersRoleAdmin):
    list_display = ['api_key', 'endpoint', 'method', 'status_code', 'response_time', 'created_at']
    list_filter = ['method', 'status_code', 'created_at']
    search_fields = ['api_key__name', 'endpoint', 'ip_address']
    ordering = ['-created_at']