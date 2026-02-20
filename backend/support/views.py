from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from support.models import SupportTicket, TicketComment
from support.serializers.support_serializers import SupportTicketSerializer, TicketCommentSerializer


class SupportTicketViewSet(viewsets.ModelViewSet):
    queryset = SupportTicket.objects.all()
    serializer_class = SupportTicketSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return SupportTicket.objects.all()
        return SupportTicket.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['get', 'post'])
    def comments(self, request, pk=None):
        ticket = self.get_object()

        if request.method == 'GET':
            comments = ticket.comments.all().order_by('created_at')
            serializer = TicketCommentSerializer(comments, many=True)
            return Response(serializer.data)

        serializer = TicketCommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(ticket=ticket, user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)