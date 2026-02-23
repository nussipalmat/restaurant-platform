from rest_framework import serializers
from orders.models import Order, OrderItem
from promotions.models import Promotion


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'
        read_only_fields = ['subtotal']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    promo_code = serializers.CharField(required=False, allow_null=True, write_only=True)

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['order_number', 'user']

    def create(self, validated_data):
        promo_code = validated_data.pop('promo_code', None)
        if promo_code:
            try:
                promotion = Promotion.objects.get(code=promo_code)
                validated_data['promo_code'] = promotion
            except Promotion.DoesNotExist:
                pass
        return super().create(validated_data)
