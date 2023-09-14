# File serializers
from rest_framework import serializers
from .models import Category, Subject

# Serializer
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

# Subject serialezer    
""" class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__' """
              
class SubjectSerializer(serializers.ModelSerializer):
    category = serializers.SerializerMethodField()
    phase = serializers.SerializerMethodField()
    modalities = serializers.SerializerMethodField()

    def get_category(self, obj):
        if obj.category_id:
            return {"id": obj.category_id.category_id, "name": obj.category_id.name}
        return None
    
    def get_phase(self, obj):
        return {"id": obj.phase_id.phase_id, "name": obj.phase_id.name}

    def get_modalities(self, obj):
        modalities = obj.modality_id.all()
        if modalities == None:
            return []
        
        return [{"id": modality.modality_id, "name": modality.name} for modality in modalities]

    class Meta:
        model = Subject
        fields = ['subject_id', 'name', 'category','subject_type', 'phase', 'modalities']
