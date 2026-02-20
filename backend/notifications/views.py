from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from notifications.models import Notification, NotificationSettings
from notifications.serializers.notification_serializers import NotificationSerializer, NotificationSettingsSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        updated_count = Notification.objects.filter(
            user=request.user,
            is_read=False
        ).update(is_read=True)

        return Response({'success': True, 'marked_count': updated_count})

    @action(detail=True, methods=['post'], url_path='mark-as-read')
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.read_at = timezone.now()
        notification.save()

        serializer = self.get_serializer(notification)
        return Response(serializer.data)


class NotificationSettingsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        settings, _ = NotificationSettings.objects.get_or_create(user=request.user)
        serializer = NotificationSettingsSerializer(settings)
        return Response(serializer.data)
    
    def patch(self, request):
        settings, _ = NotificationSettings.objects.get_or_create(user=request.user)
        serializer = NotificationSettingsSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_unread_count(request):
    count = Notification.objects.filter(
        user=request.user,
        is_read=False
    ).count()
    
    return Response({'count': count})