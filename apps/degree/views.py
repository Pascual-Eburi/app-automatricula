from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from .models import Degree
from .serializers import *
from core.utils import is_valid_number

#***************************************************
#   DEGREE API VIEWS
#***************************************************

class DegreeDetailView(APIView):
    permission_classes = (permissions.AllowAny, )
    
    def get(self, request, id, format = None):
        if is_valid_number(id) == False:
            return Response(
                {'error': 'El id tiene que ser un número entero'},
                status = status.HTTP_400_BAD_REQUEST
            )
        
        if Degree.objects.filter(degree_id = id).exists():
            
            # exists data
            degree = Degree.objects.get(degree_id = id)
            degree = DegreeSerializer(degree)
            
            return Response(
                {'degree': degree.data},
                status=status.HTTP_200_OK
            )
            
        return Response(
                {'type': 'error', 'message': 'No existe carrera con este id'},
                status=status.HTTP_404_NOT_FOUND
            )




class ListDegreeView(APIView):
    permission_classes = (permissions.AllowAny, )
    def get(self, request, format = None):
        
        if Degree.objects.all().exists() == False:
            return Response(
                {'type':'warning', 'message': 'No hay carreras registradas'},
                status = status.HTTP_204_NO_CONTENT 
            )
            
        sortBy = request.query_params.get('sortBy')
        modality = request.query_params.get('modality') or None
        
        if sortBy not in ['degree_id', 'name']:
            sortBy = 'degree_id'
        
        
        if modality:
            degrees = Degree.objects.filter(modality = modality) or None
            if degrees is None:
                return Response(
                    {'type': 'warning', 'message': 'No se ha encontrado carreras para la modalidad'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            degrees_serializer = DegreeSerializer(degrees, many = True)
                        
            return Response(
                {'degrees': degrees_serializer.data},
                status= status.HTTP_200_OK
            )
               
         
        degrees = Degree.objects.order_by(sortBy).all()
        degrees = DegreeSerializer(degrees, many = True)
        if degrees:
            return Response(
                {'degrees': degrees.data},
                status= status.HTTP_200_OK
            )
            
        return Response(
            {'type':'warning', 'message': 'No se ha encontrado carreras'},
            status = status.HTTP_404_NOT_FOUND
        )
        




class CreateDegreeView(APIView):
    pass



class EditDegreeView(APIView):
    pass



class DeleteDegreeView(APIView):
    pass


