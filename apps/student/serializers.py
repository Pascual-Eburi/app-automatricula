# File serializers
from rest_framework import serializers
from apps.enrollment.models import Enrollment
from .models import *

from datetime import date

class StudentSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    institute = serializers.SerializerMethodField()
    district = serializers.SerializerMethodField()
    modality = serializers.SerializerMethodField()
    age = serializers.SerializerMethodField()
    number_of_enrollments = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = [
            'user',
            'photo',
            'dob',
            'age',
            'village',
            'school_report',
            'gender',
            'high_school_grade',
            'doc_type',
            'doc_number',
            'address',
            'institute',
            'district',
            'modality',
            'number_of_enrollments'
        ]

    def get_user(self, obj):
        user = obj.user
        return {
            'code': user.pk,
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
        

    def get_district(self, obj):
        district = obj.district
        if district:
            return district.name,

        return None

    def get_modality(self, obj):
        modality = obj.modality
        #return modality.name
        return {
            'name': modality.name,
            'id': modality.modality_id
        }

    def get_age(self, obj):
        today = date.today()
        age = today.year - obj.dob.year
        if today.month < obj.dob.month or (today.month == obj.dob.month and today.day < obj.dob.day):
            age -= 1
        return age

    def get_number_of_enrollments(self, obj):
        return Enrollment.objects.filter(student=obj).count()
    
    
""" class StudentSerialiezer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__' """




