from rest_framework import serializers
from reservations.models import Reservation


class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = '__all__'
        read_only_fields = [
            'user', 
            'status', 
            'created_at', 
            'updated_at', 
            'cancelled_at', 
            'cancellation_reason'
        ]