from django.contrib import admin
from support.models import SupportTicket, TicketComment


class SupportRoleAdmin(admin.ModelAdmin):
    def has_module_permission(self, request):
        if request.user.is_superuser:
            return True
        return request.user.is_authenticated and request.user.role in ['ADMIN', 'STAFF']

class TicketCommentInline(admin.TabularInline):
    model = TicketComment
    extra = 0


@admin.register(SupportTicket)
class SupportTicketAdmin(SupportRoleAdmin):
    list_display = ['ticket_number', 'user', 'category', 'subject', 'status', 'priority', 'created_at']
    list_filter = ['status', 'priority', 'category', 'created_at']
    search_fields = ['ticket_number', 'user__email', 'subject', 'description']
    readonly_fields = ['ticket_number']
    ordering = ['-created_at']
    inlines = [TicketCommentInline]

@admin.register(TicketComment)
class TicketCommentAdmin(SupportRoleAdmin):
    list_display = ['ticket', 'user', 'is_staff_response', 'created_at']
    list_filter = ['is_staff_response', 'created_at']
    search_fields = ['ticket__ticket_number', 'user__email', 'comment']
    ordering = ['-created_at']