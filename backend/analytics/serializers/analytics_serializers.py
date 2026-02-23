from rest_framework import serializers
from analytics.models import DailySalesReport, RevenueTrend, PopularItem


class DailySalesReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailySalesReport
        fields = '__all__'


class RevenueTrendSerializer(serializers.ModelSerializer):
    class Meta:
        model = RevenueTrend
        fields = '__all__'


class PopularItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PopularItem
        fields = '__all__'
