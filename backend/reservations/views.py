from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils.dateparse import parse_date
from django.utils import timezone
from datetime import datetime
from reservations.models import Reservation
from reservations.serializers.reservation_serializers import ReservationSerializer
from restaurants.models import Restaurant, Table


class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Reservation.objects.none()
        
        if user.role == 'CUSTOMER':
            return Reservation.objects.filter(user=user)
        elif user.role == 'RESTAURANT_OWNER':
            return Reservation.objects.filter(restaurant__owner=user)
        elif user.role == 'ADMIN':
            return Reservation.objects.all()
        return Reservation.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'], url_path='available-tables')
    def available_tables(self, request):
        restaurant_id = request.query_params.get('restaurant')
        date_str = request.query_params.get('date')
        time_str = request.query_params.get('time')
        guests_str = request.query_params.get('guests')

        if not all([restaurant_id, date_str, time_str, guests_str]):
            return Response(
                {'error': 'restaurant, date, time, and guests parameters are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            guests = int(guests_str)
            reservation_date = parse_date(date_str)
            if not reservation_date:
                raise ValueError("Invalid date format")
            try:
                reservation_time = datetime.strptime(time_str, '%H:%M').time()
            except ValueError:
                reservation_time = datetime.strptime(time_str, '%H:%M:%S').time()
        except (ValueError, TypeError) as e:
            return Response(
                {'error': f'Invalid parameters: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            restaurant = Restaurant.objects.get(id=restaurant_id)
        except Restaurant.DoesNotExist:
            return Response(
                {'error': 'Restaurant not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        tables = Table.objects.filter(
            restaurant=restaurant,
            capacity__gte=guests,
            is_available=True
        ).order_by('table_number')

        available_tables = []
        for table in tables:
            conflicting = Reservation.objects.filter(
                table=table,
                reservation_date=reservation_date,
                reservation_time=reservation_time,
                status__in=['PENDING', 'CONFIRMED', 'SEATED']
            ).exists()
            if not conflicting:
                available_tables.append({
                    'id': table.id,
                    'table_number': table.table_number,
                    'capacity': table.capacity,
                    'location': table.location or 'Indoor',
                })

        return Response({
            'results': available_tables,
            'count': len(available_tables)
        })

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        reservation = self.get_object()
        
        if reservation.status == 'CANCELLED':
            return Response(
                {'error': 'Reservation is already cancelled'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if reservation.status in ['COMPLETED', 'NO_SHOW']:
            return Response(
                {'error': f'Cannot cancel a reservation with status: {reservation.status}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        reservation.status = 'CANCELLED'
        reservation.cancelled_at = timezone.now()
        reservation.cancellation_reason = request.data.get('reason', 'Cancelled by user')
        reservation.save()
        
        serializer = self.get_serializer(reservation)
        return Response(serializer.data)