from rest_framework import serializers
from .models import Province, District

# Serializer for model District
class DistrictSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = District
        # fields = '__all__'
        fields = ['district_id', 'name', 'province_id']

# Serializer for model Province
class ProvinceSerializer(serializers.ModelSerializer):
    districts = DistrictSerializer(many = True, read_only = True, )
    
    class Meta:
        model = Province
        fields = ['province_id', 'name', 'districts']

        




