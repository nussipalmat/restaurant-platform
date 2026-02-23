from decimal import Decimal
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated

from orders.models import Order
from orders.serializers.order_serializers import OrderSerializer
from promotions.models import Promotion


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Order.objects.none()
        
        if user.role == 'CUSTOMER':
            return Order.objects.filter(user=user)
        elif user.role == 'RESTAURANT_OWNER':
            return Order.objects.filter(restaurant__owner=user)
        elif user.role == 'ADMIN':
            return Order.objects.all()
        return Order.objects.none()

    def perform_create(self, serializer):
        validated_data = serializer.validated_data
        promo_code_value = validated_data.get('promo_code')

        if promo_code_value and isinstance(promo_code_value, str):
            try:
                promotion = Promotion.objects.get(code=promo_code_value, is_active=True)

                if not promotion.is_valid:
                    raise ValidationError({'promo_code': 'Promo code is not valid or expired'})

                subtotal = Decimal(str(validated_data.get('subtotal', '0')))
                delivery_fee = Decimal(str(validated_data.get('delivery_fee', '0')))
                tax = Decimal(str(validated_data.get('tax', '0')))
                discount = Decimal('0')

                if promotion.promotion_type == 'PERCENTAGE':
                    discount = subtotal * (promotion.discount_percentage / Decimal('100'))
                    if promotion.maximum_discount:
                        discount = min(discount, promotion.maximum_discount)
                elif promotion.promotion_type == 'FIXED':
                    discount = promotion.discount_amount or Decimal('0')
                elif promotion.promotion_type == 'FREE_DELIVERY':
                    discount = delivery_fee

                validated_data['discount'] = discount
                validated_data['total'] = subtotal + tax + delivery_fee - discount

                promotion.usage_count += 1
                promotion.save()

            except Promotion.DoesNotExist:
                raise ValidationError({'promo_code': 'Invalid promo code'})

        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        order = self.get_object()

        if order.status in ['CANCELLED', 'COMPLETED', 'DELIVERED']:
            return Response(
                {"detail": f"Невозможно отменить заказ статусом {order.status}."},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = 'CANCELLED'
        order.save()

        return Response(
            {"detail": "Заказ успешно отменен.", "status": order.status},
            status=status.HTTP_200_OK
        )