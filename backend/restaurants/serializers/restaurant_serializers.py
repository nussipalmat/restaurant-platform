from rest_framework import serializers
from django.utils import timezone
from datetime import datetime
from restaurants.models import Restaurant, RestaurantImage, Review, Table


class RestaurantSerializer(serializers.ModelSerializer):
    is_open_now = serializers.SerializerMethodField()
    
    class Meta:
        model = Restaurant
        fields = '__all__'
        read_only_fields = ['owner', 'average_rating', 'total_reviews', 'slug']
    
    def get_is_open_now(self, obj):
        if not obj.is_accepting_orders or obj.status != 'ACTIVE':
            return False
        if not obj.business_hours:
            return True
        now = timezone.localtime(timezone.now())
        day_name = now.strftime('%A').lower()
        if day_name not in obj.business_hours:
            return False
        today_hours = obj.business_hours[day_name]
        if not today_hours.get('open') or not today_hours.get('close'):
            return False
        current_time = now.time()
        try:
            open_str = today_hours['open']
            close_str = today_hours['close']
            if len(open_str) == 5:
                open_time = datetime.strptime(open_str, '%H:%M').time()
                close_time = datetime.strptime(close_str, '%H:%M').time()
            else:
                open_time = datetime.strptime(open_str, '%H:%M:%S').time()
                close_time = datetime.strptime(close_str, '%H:%M:%S').time()
            if open_time.hour == 0 and open_time.minute == 0 and close_time.hour == 23 and close_time.minute == 59:
                return True
            return open_time <= current_time <= close_time
        except:
            return False


class RestaurantImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantImage
        fields = '__all__'


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ['user']


class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = '__all__'
