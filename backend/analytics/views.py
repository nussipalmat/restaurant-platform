from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from analytics.models import DailySalesReport
from analytics.serializers.analytics_serializers import DailySalesReportSerializer


class DailySalesReportViewSet(viewsets.ModelViewSet):
    queryset = DailySalesReport.objects.all()
    serializer_class = DailySalesReportSerializer
    permission_classes = [IsAuthenticated]


