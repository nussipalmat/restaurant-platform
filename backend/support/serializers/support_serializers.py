from rest_framework import serializers
from support.models import SupportTicket, TicketComment


class TicketCommentSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = TicketComment
        fields = ['id', 'ticket', 'user', 'user_email', 'user_name', 'comment', 'is_staff_response', 'created_at', 'updated_at']
        read_only_fields = ['user', 'ticket', 'user_email', 'user_name', 'is_staff_response', 'created_at', 'updated_at']

    def get_user_name(self, obj):
        return obj.user.get_full_name() or obj.user.email


class SupportTicketSerializer(serializers.ModelSerializer):
    comments = TicketCommentSerializer(many=True, read_only=True)
    
    class Meta:
        model = SupportTicket
        fields = '__all__'
        read_only_fields = ['ticket_number', 'user']
