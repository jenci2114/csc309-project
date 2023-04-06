# serializer for register user

from rest_framework import serializers
from .models import User, Notification
from django.core.validators import validate_email

class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    class Meta:
        model = User
        fields = ['username', 'password', 'password2', 'email']
        # hide the password from the response
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        username = data['username']
        password = data['password']
        password2 = data['password2']
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError("Username already exists")
        elif password != password2:
            raise serializers.ValidationError("Passwords must match")
        elif len(password) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long")
        return data
    
    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class ProfileEditSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True, required=False)
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name', 'phone', 'location', 'avatar_url']
        # make username and email unchangeable AND everrything
        extra_kwargs = {'username': {'read_only': True}, 
                        'email': {'required': False},
                        'password': {'required': False, 'write_only': True}, 
                        'password2': {'required': False},
                        'first_name': {'required': False}, 
                        'last_name': {'required': False}, 
                        'phone': {'required': False}, 
                        'location': {'required': False}, 
                        'avatar_url': {'required': False}}

    def update(self, instance, validated_data):
        if 'email' in validated_data:
            email = validated_data.get('email', instance.email)
            try: 
                validate_email(email)
            except: 
                raise serializers.ValidationError("Invalid email")
            else:
                instance.email = validated_data.get('email', instance.email)
        if 'first_name' in validated_data:
            instance.first_name = validated_data.get('first_name', instance.first_name)
        if 'last_name' in validated_data:
            instance.last_name = validated_data.get('last_name', instance.last_name)
        if 'phone' in validated_data:
            instance.phone = validated_data.get('phone', instance.phone)
        if 'location' in validated_data:
            instance.location = validated_data.get('location', instance.location)
        if 'avatar_url' in validated_data:
            instance.avatar_url = validated_data.get('avatar_url', instance.avatar_url)
        if 'password' in validated_data and 'password2' in validated_data:
            password = validated_data.get('password', instance.password)
            password2 = validated_data.get('password2', validated_data['password2'])
            if password != password2:
                raise serializers.ValidationError("Passwords must match")
            elif len(password) < 8:
                raise serializers.ValidationError("Password must be at least 8 characters long")
            else:
                instance.set_password(password)
        elif 'password' in validated_data or 'password2' in validated_data:
            raise serializers.ValidationError("Both passwords must be provided")
        instance.save()
        return instance
    
class NotificationSerializer(serializers.ModelSerializer):
    user_from = serializers.ReadOnlyField(source='user_from.username')
    class Meta:
        model = Notification
        fields = ['msg', 'time', 'user_from']






