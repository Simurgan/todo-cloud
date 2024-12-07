from rest_framework import serializers
from django.contrib.auth.models import User
from database.models import TodoItem

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
