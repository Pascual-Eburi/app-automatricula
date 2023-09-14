from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from .models import Subject, Category
from apps.phase.models import Phase
from .serializers import *
from core.utils import is_valid_number

#***************************************************
#   Category Subject API VIEWS
#***************************************************
class CategoryDetailView(APIView):
    permission_classes = (permissions.AllowAny, )
    
    def get(self, request, id, format = None):
        if is_valid_number(id) == False:
            return Response(
                {'error': 'El id tiene que ser un número entero'},
                status = status.HTTP_400_BAD_REQUEST
            )
        
        if Category.objects.filter(category_id = id).exists():
            
            # exists data
            category = Category.objects.get(category_id = id)
            category = CategorySerializer(category)
            
            return Response(
                {'category': category.data},
                status=status.HTTP_200_OK
            )
            
        return Response(
            {'type': 'error', 'message': 'No existe categoria con este id'},
            status=status.HTTP_404_NOT_FOUND
        )



class ListCategoryView(APIView):
    permission_classes = (permissions.AllowAny, )
    def get(self, request, format = None):
        
        if Category.objects.all().exists() == False:
            return Response(
                {'type':'warning', 'message': 'No hay categorias registradas'},
                status = status.HTTP_204_NO_CONTENT 
            )
            
        sortBy = request.query_params.get('sortBy')
        
        if sortBy not in ['category_id', 'name']:
            sortBy = 'category_id'
            
        categories = Category.objects.order_by(sortBy).all()
        categories = CategorySerializer(categories, many = True)
        if categories:
            return Response(
                {'categories': categories.data},
                status= status.HTTP_200_OK
            )
            
        return Response(
            {'type':'warning', 'message': 'No se ha encontrado categorias'},
            status = status.HTTP_404_NOT_FOUND
        )
        



class CreateCategoryView(APIView):
    pass


class EditCategoryView(APIView):
    pass


class DeleteCategoryView(APIView):
    pass





#***************************************************
#   Subject API VIEWS
#***************************************************

class SubjectDetailView(APIView):
    permission_classes = (permissions.AllowAny, )
    
    def get(self, request, id, format = None):
        if is_valid_number(id) == False:
            return Response(
                {'error': 'El id tiene que ser un número entero'},
                status = status.HTTP_400_BAD_REQUEST
            )
        
        if Subject.objects.filter(subject_id = id).exists():
            
            # exists data
            subject = Subject.objects.get(subject_id = id)
            subject = SubjectSerializer(subject)
            
            return Response(
                {'subject': subject.data},
                status=status.HTTP_200_OK
            )
            
        return Response(
                {'type': 'error', 'message': 'No existe asignatura con este id'},
                status=status.HTTP_404_NOT_FOUND
            )




class ListSubjectView(APIView):
    permission_classes = (permissions.AllowAny, )
    def get(self, request, format = None):
        
        if Subject.objects.all().exists() == False:
            return Response(
                {'type':'warning', 'message': 'No hay asignaturas registradas'},
                status = status.HTTP_204_NO_CONTENT 
            )
            
        sortBy = request.query_params.get('sortBy')
        
        if sortBy not in ['subject_id', 'name']:
            sortBy = 'subject_id'
        
        
        phase_name = request.query_params.get('phase') or None
        modality = request.query_params.get('modality') or None
        
        # get subjects by phase name:
        if phase_name:
 
            phase = Phase.objects.filter(name=phase_name).first()

            if phase is None:
                return Response(
                    {'type': 'warning', 'message': 'No se ha encontrado la fase'},
                    status=status.HTTP_404_NOT_FOUND
                )
                    
            subjects = Subject.objects.filter(phase_id=phase).order_by(sortBy)
            subjects_serializer = SubjectSerializer(subjects, many=True)

            return Response(
                {'subjects': subjects_serializer.data},
                status=status.HTTP_200_OK
            )
        
        # get subjects by modality
        if modality:
            subjects = Subject.objects.filter(modality_id=modality) or None

            if subjects is None:
                return Response(
                    {'type': 'warning', 'message': 'No se ha encontrado asignaturas para la modalidad'},
                    status=status.HTTP_404_NOT_FOUND
                )
                
            subjects_serializer = SubjectSerializer(subjects, many=True)
            return Response(
                {'subjects': subjects_serializer.data},
                status=status.HTTP_200_OK
            )
        
        
        # Get all subjects
        subjects = Subject.objects.order_by(sortBy).all()
        subjects = SubjectSerializer(subjects, many = True)
        if subjects:
            return Response(
                {'subjects': subjects.data},
                status= status.HTTP_200_OK
            )
            
        return Response(
            {'type':'warning', 'message': 'No se ha encontrado asignaturas'},
            status = status.HTTP_404_NOT_FOUND
        )
        



class CreateSubjectView(APIView):
    pass


class EditSubjectView(APIView):
    pass


class DeleteSubjectView(APIView):
    pass

