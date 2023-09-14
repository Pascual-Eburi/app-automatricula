# File serializers
from djoser.serializers import UserCreateSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserCreateSerializer(UserCreateSerializer):
    
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = (
            'id',
            'email',
            'name',
            'last_name',
            'rol',
            'phone',
            'is_active',
            'is_staff',
            'is_superuser',
            'date_joined',
            'last_login',
            'get_full_name',
            'get_short_name',
        )
        
        