# File serializers
from rest_framework import serializers
from .models import InstituteStaff, Institute

class InstituteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institute
        fields = ('code', 'name',)

class InstituteStaffSerializer(serializers.ModelSerializer):
    institute = InstituteSerializer()

    class Meta:
        model = InstituteStaff
        fields = ('user', 'photo', 'institute', 'doc_type', 'doc_number', 'job_title')

class ListInstituteStaffSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    institute = serializers.SerializerMethodField()
    
    class Meta:
        model = InstituteStaff
        fields = ('user', 'photo', 'institute', 'doc_type', 'doc_number', 'job_title',)
    
    

    def get_user(self, obj):
        user = obj.user
        return {
            'id': user.pk,
            'name': user.name,
            'last_name': user.last_name,
            'phone': user.phone,
            'email': user.email
        }
        
    def get_institute(self, obj):
        institute = obj.institute
        if institute:
            return institute.name
        
        return None