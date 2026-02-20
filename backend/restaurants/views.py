from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from restaurants.models import Restaurant, Review
from restaurants.serializers.restaurant_serializers import RestaurantSerializer, ReviewSerializer
from core.permissions import IsRestaurantOwnerOrReadOnly


class RestaurantViewSet(viewsets.ModelViewSet):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsRestaurantOwnerOrReadOnly]
    lookup_field = 'slug'
    
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['price_range', 'status']
    search_fields = ['name', 'description']
    ordering_fields = ['average_rating', 'created_at', 'name']
    ordering = ['-average_rating']
    
    def get_queryset(self):
        queryset = Restaurant.objects.all()
        
        if not self.request.user.is_authenticated or self.request.user.role != 'RESTAURANT_OWNER':
            queryset = queryset.filter(status='ACTIVE')
        
        cuisine = self.request.query_params.get('cuisine_type')
        if cuisine:
            queryset = queryset.filter(cuisine_type__contains=[cuisine])
        
        min_rating = self.request.query_params.get('min_rating')
        if min_rating:
            try:
                queryset = queryset.filter(average_rating__gte=float(min_rating))
            except ValueError:
                pass
        
        return queryset


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        return Review.objects.filter(restaurant_id=self.kwargs['restaurant_pk'])
    
    def perform_create(self, serializer):
        restaurant_pk = self.kwargs.get('restaurant_pk')
        serializer.save(
            user=self.request.user,
            restaurant_id=restaurant_pk
        )