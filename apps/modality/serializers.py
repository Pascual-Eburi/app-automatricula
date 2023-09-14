# File serializers

from rest_framework import serializers
from .models import Modality
from apps.subject.serializers import SubjectSerializer

# Serializer
class ModalitySerializer(serializers.ModelSerializer):
    # get all modality's subjects
    subjects = SubjectSerializer(many = True, read_only = True)
    class Meta:
        model = Modality
        fields = '__all__'