# File serializers
from rest_framework import serializers
from .models import Announcement

# Serializer
class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = '__all__'
