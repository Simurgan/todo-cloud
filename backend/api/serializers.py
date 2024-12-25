from rest_framework import serializers
from django.contrib.auth.models import User
from database.models import TodoItem
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from datetime import datetime, timezone

class UserSignupSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['email', 'password']

    def validate_email(self, value):
        # Ensure the email is unique
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        email = validated_data['email']
        password = validated_data['password']
        
        # Assign email as the username
        user = User.objects.create_user(
            username=email,  # Set email as username
            email=email,
            password=password
        )
        return user

class TodoItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = TodoItem
        fields = '__all__'

# Custom serializer for /auth/token/ (login)
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        return token

    def validate(self, attrs):
        data = super().validate(attrs)  # Generate default tokens (access and refresh)

        # Add token expiration times
        refresh = self.get_token(self.user)
        access_token = refresh.access_token

        data['refresh_expires_at'] = datetime.fromtimestamp(refresh['exp'], timezone.utc).isoformat()
        data['access_expires_at'] = datetime.fromtimestamp(access_token['exp'], timezone.utc).isoformat()

        return data

# Custom serializer for /auth/token/refresh/
class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)  # Generate new access token

        # Get expiration time of the new access token
        access_token = AccessToken(data['access'])
        data['access_expires_at'] = datetime.fromtimestamp(access_token['exp'], timezone.utc).isoformat()

        return data
