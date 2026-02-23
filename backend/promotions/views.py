from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from django.utils import timezone
from promotions.models import Promotion
from promotions.serializers.promotion_serializers import PromotionSerializer


class PromotionViewSet(viewsets.ModelViewSet):
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    @action(detail=False, methods=['post'])
    def validate(self, request):
        code = request.data.get('code')
        restaurant_id = request.data.get('restaurant')
        subtotal = request.data.get('subtotal')

        if not code:
            return Response({'error': 'Promo code is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            promotion = Promotion.objects.get(code=code)
        except Promotion.DoesNotExist:
            return Response({'error': 'Invalid promo code'}, status=status.HTTP_404_NOT_FOUND)

        now = timezone.now()
        if not promotion.is_active or promotion.start_date > now or promotion.end_date < now:
            return Response({'error': 'This promo code is not active'}, status=status.HTTP_400_BAD_REQUEST)

        if subtotal and promotion.minimum_order_amount and float(subtotal) < float(promotion.minimum_order_amount):
            return Response(
                {'error': f'Minimum order amount is {promotion.minimum_order_amount}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        discount = 0
        if promotion.promotion_type == 'PERCENTAGE' and promotion.discount_percentage:
            discount = float(subtotal or 0) * (float(promotion.discount_percentage) / 100)
            if promotion.maximum_discount:
                discount = min(discount, float(promotion.maximum_discount))
        elif promotion.promotion_type == 'FIXED' and promotion.discount_amount:
            discount = float(promotion.discount_amount)

        return Response({
            'valid': True,
            'code': promotion.code,
            'discount': discount,
            'promotion_type': promotion.promotion_type,
            'discount_percentage': promotion.discount_percentage,
            'discount_amount': promotion.discount_amount,
            'description': promotion.description,
        })