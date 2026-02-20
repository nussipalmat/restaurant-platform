from rest_framework import status, generics, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import authenticate
from users.models import User, Address, UserProfile
from users.serializers.user_serializers import (
    UserRegistrationSerializer,
    UserSerializer,
    UserProfileSerializer,
    AddressSerializer,
    ChangePasswordSerializer,
    ChangeEmailSerializer
)
from core.permissions import IsOwnerOrReadOnly

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer

@api_view(['GET', 'PATCH', 'PUT'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    if request.method == 'GET':
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    elif request.method in ['PATCH', 'PUT']:
        partial = request.method == 'PATCH'
        serializer = UserSerializer(
            request.user, 
            data=request.data, 
            partial=partial
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user

class UserProfileUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            
            if not user.check_password(serializer.validated_data['old_password']):
                return Response(
                    {"old_password": ["Wrong password."]},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            return Response(
                {"detail": "Password updated successfully."},
                status=status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChangeEmailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = ChangeEmailSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            
            if not user.check_password(serializer.validated_data['password']):
                return Response(
                    {"password": ["Wrong password."]},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            user.email = serializer.validated_data['new_email']
            user.is_email_verified = False
            user.save()
            
            return Response(
                {"detail": "Email updated successfully. Please verify your new email."},
                status=status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)