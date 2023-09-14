from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions


from .models import Modality
from .serializers import *
from core.utils import is_valid_number

#***************************************************
#   MODALITY API VIEWS
#***************************************************

#GET SINGLE
class ModalityDetailView(APIView):
    permission_classes = (permissions.AllowAny, )
    def get(self, request, id, format = None):
        if is_valid_number(id) == False:
            return Response(
                {'error': 'El id tiene que ser un número entero'},
                status = status.HTTP_400_BAD_REQUEST
            )
        
        if Modality.objects.filter(modality_id = id).exists():
            
            # exists data
            modality = Modality.objects.get(modality_id = id)
            modality = ModalitySerializer(modality)
            
            return Response(
                {'modality': modality.data},
                status=status.HTTP_200_OK
            )
            
        return Response(
                {'type': 'error', 'message': 'No existe modalidad con este id'},
                status=status.HTTP_404_NOT_FOUND
            )
    

# GET LIST
class ListModalityView(APIView):
    permission_classes = (permissions.AllowAny, )
    def get(self, request, format = None):
        if Modality.objects.all().exists() == False:
            return Response(
                {'type':'warning', 'message': 'No hay modalidades registradas'},
                status = status.HTTP_204_NO_CONTENT 
            )
            
        sortBy = request.query_params.get('sortBy')
        
        if sortBy not in ['modality_id', 'name']:
            sortBy = 'modality_id'
            
        modalities = Modality.objects.order_by(sortBy).all()
        modalities = ModalitySerializer(modalities, many = True)
        if modalities:
            return Response(
                {'modalities': modalities.data},
                status= status.HTTP_200_OK
            )
            
        return Response(
            {'type':'warning', 'message': 'No se ha encontrado modalidades'},
            status = status.HTTP_404_NOT_FOUND
        )
        

# CREATE
class CreateModalityView(APIView):
    pass


# UPDATE
class EditModalityView(APIView):
    pass

# DELETE
class DeleteModalityView(APIView):
    pass