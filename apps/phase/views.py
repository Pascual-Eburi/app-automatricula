from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from .models import Phase
from .serializers import *
from core.utils import is_valid_number


#***************************************************
#   PHASE API VIEWS
#***************************************************

        
class PhaseDetailView(APIView):
    permission_classes = (permissions.AllowAny, )
    def get(self, request, id, format = None):
        if is_valid_number(id) == False:
            return Response(
                {'type': 'error', 'message':'El id tiene que ser un número entero'},
                status = status.HTTP_400_BAD_REQUEST
            )
        
        if Phase.objects.filter(phase_id = id).exists():
            
            # exists data
            phase = Phase.objects.get(phase_id = id)
            phase = PhaseSerializer(phase)
            
            return Response(
                {'phase': phase.data},
                status=status.HTTP_200_OK
            )
            
        return Response(
                {'type': 'error', 'message': 'No existe fase con este id'},
                status=status.HTTP_404_NOT_FOUND
            )


class ListPhaseView(APIView):
    permission_classes = (permissions.AllowAny, )
    def get(self, request, format = None):
        
        if Phase.objects.all().exists() == False:
            return Response(
                {'type':'warning', 'message': 'No hay fases registradas'},
                status = status.HTTP_204_NO_CONTENT 
            )
            
        sortBy = request.query_params.get('sortBy')
        
        if sortBy not in ['phase_id', 'name']:
            sortBy = 'phase_id'
            
        phases = Phase.objects.order_by(sortBy).all()
        phases = PhaseSerializer(phases, many = True)
        if phases:
            return Response(
                {'phases': phases.data},
                status= status.HTTP_200_OK
            )
            
        return Response(
            {'type':'warning', 'message': 'No se ha encontrado fases'},
            status = status.HTTP_404_NOT_FOUND
        )
        



class CreatePhaseView(APIView):
    pass


class EditPhaseView(APIView):
    pass


class DeletePhaseView(APIView):
    pass


