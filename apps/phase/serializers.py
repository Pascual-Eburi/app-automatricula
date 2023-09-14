# File serializers

from rest_framework import serializers
from .models import Phase
from apps.subject.serializers import SubjectSerializer

# Serializer
class PhaseSerializer(serializers.ModelSerializer):
    # all phase's subjects
    subjects = SubjectSerializer(many = True, read_only = True)
    class Meta:
        model = Phase
        fields = '__all__'
