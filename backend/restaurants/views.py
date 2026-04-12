from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from restaurants.models import Restaurant, Review, Table
from restaurants.serializers.restaurant_serializers import RestaurantSerializer, ReviewSerializer, TableSerializer
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
        else:
            queryset = queryset.filter(owner=self.request.user)

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


class TableViewSet(viewsets.ModelViewSet):
    queryset = Table.objects.all()
    serializer_class = TableSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Table.objects.select_related('restaurant').all()
        restaurant_id = self.request.query_params.get('restaurant')
        if restaurant_id:
            queryset = queryset.filter(restaurant_id=restaurant_id)

        user = self.request.user
        if user.role == 'RESTAURANT_OWNER':
            queryset = queryset.filter(restaurant__owner=user)
        elif user.role != 'ADMIN':
            queryset = queryset.none()

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
