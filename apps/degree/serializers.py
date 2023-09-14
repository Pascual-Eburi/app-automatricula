# File serializers
from rest_framework import serializers
from .models import Degree

# Serializer for model Degree
class DegreeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Degree
        fields = '__all__'