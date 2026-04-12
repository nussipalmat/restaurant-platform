from rest_framework import serializers
from reservations.models import Reservation


class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = '__all__'
        read_only_fields = [
            'user', 
            'created_at', 
            'updated_at', 
            'cancelled_at', 
            'cancellation_reason'
        ]