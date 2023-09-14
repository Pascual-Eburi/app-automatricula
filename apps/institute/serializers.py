from rest_framework import serializers
from .models import Institute, ExamCenterAssignment

# Serializer for model Institute
class InstituteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institute
        fields = '__all__'



# serializer for model ExamCenterAssigment
class ExamCenterAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamCenterAssignment
        fields = '__all__'