from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core import exceptions
from users.models import User, Address, UserProfile


class UserRegistrationSerializer(serializers.ModelSerializer):
    
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'}, label='Confirm Password')
    
    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password2', 'first_name', 'last_name', 'phone', 'role']
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
        }
    
    def validate(self, attrs):
        """Validate passwords match and meet requirements."""
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        try:
            validate_password(attrs['password'])
        except exceptions.ValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})
        
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            phone=validated_data.get('phone', ''),
            role=validated_data.get('role', 'CUSTOMER')
        )
        UserProfile.objects.create(user=user)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = UserProfile
        fields = ['bio', 'dietary_preferences', 'favorite_cuisines', 'allergens', 'loyalty_points']
        read_only_fields = ['loyalty_points']


class UserSerializer(serializers.ModelSerializer):
    
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'phone', 'role', 
                  'profile_image', 'date_of_birth', 'is_email_verified', 'profile', 'created_at']
        read_only_fields = ['id', 'email', 'role', 'is_email_verified', 'created_at']


class AddressSerializer(serializers.ModelSerializer):

    address_type_display = serializers.CharField(source='get_address_type_display', read_only=True)

    class Meta:
        model = Address
        fields = ['id', 'address_type', 'address_type_display', 'street_address', 'apartment_number', 'city',
                  'state', 'postal_code', 'country', 'is_default', 'latitude', 'longitude',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate(self, attrs):
        
        return attrs


class ChangePasswordSerializer(serializers.Serializer):
    
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)
    new_password2 = serializers.CharField(required=True, write_only=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({"new_password": "Password fields didn't match."})
        
        try:
            validate_password(attrs['new_password'])
        except exceptions.ValidationError as e:
            raise serializers.ValidationError({"new_password": list(e.messages)})
        
        return attrs


class ChangeEmailSerializer(serializers.Serializer):
    
    new_email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    
    def validate_new_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value
