from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from users import views

router = DefaultRouter()
router.register(r'addresses', views.AddressViewSet, basename='address')

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('register/', views.UserRegistrationView.as_view(), name='user-register'),
    path('me/', views.get_current_user, name='current-user'),
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('profile/update/', views.UserProfileUpdateView.as_view(), name='user-profile-update'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change-password'),
    path('change-email/', views.ChangeEmailView.as_view(), name='change-email'),
    
    path('', include(router.urls)),
]