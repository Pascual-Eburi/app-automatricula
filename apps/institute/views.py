from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from .models import Institute, ExamCenterAssignment
from .serializers import InstituteSerializer, ExamCenterAssignmentSerializer

from core.utils import is_valid_number


# get single Institute
class InstituteDetailView(APIView):
    permission_classes = (permissions.AllowAny, )
    
    def get(self, request, id, format = None):
        # validate id
        if is_valid_number(id) == False:
            return Response(
                {'type': 'error', 'message': 'El id tiene que ser un número'},
                status = status.HTTP_400_BAD_REQUEST
            )
        
            
        # check if the institute exists
        if Institute.objects.filter(code = id).exists():
   
            # ok, the institute exits --> serialize
            institute = Institute.objects.get(code = id)
            institute = InstituteSerializer(institute)
            
            return Response(
                {'institute': institute.data}, 
                status=status.HTTP_200_OK
            )
            
        else:
            return Response(
                {'type': 'warning', 'message': 'No existe instituto con este codigo'},
                status=status.HTTP_404_NOT_FOUND
            )
            

# get list of institutes
class ListInstituteView(APIView):
    permission_classes = (permissions.AllowAny, )
    def get(self, request, format = None):
        
        if Institute.objects.all().exists() == False:
            return Response(
                {'institutes': []},
                status = status.HTTP_204_NO_CONTENT
            )
        
        sortBy = request.query_params.get('sortBy')
        
        if sortBy not in ['code', 'name']:
            sortBy = 'name'
        
        # ordering
        # limit
        institutes = Institute.objects.order_by(sortBy).all()
        
        institutes = InstituteSerializer(institutes, many = True)
        
        if institutes:
            return Response(
                {'institutes': institutes.data},
                status = status.HTTP_200_OK
            )
        else:
            return Response(
                {'type':'warning', 'message': 'No se ha encontrado institutos'},
                status = status.HTTP_404_NOT_FOUND
            )
            


#*************************************************************
#       EXAM CENTER ASSIGMENT API VIEWS
#*************************************************************
# get singe ExamCenterAssigment
class ExamCenterAssigmentDetailView(APIView):
    permission_classes = (permissions.AllowAny, )   
    def get(self, request, id, format = None):
        if is_valid_number(id) == False:
            return Response(
                {'type': 'error', 'message': 'El id tiene que ser un número entero'},
                status = status.HTTP_400_BAD_REQUEST
            )
        
        if ExamCenterAssignment.objects.filter(assign_id = id).exists():
            
            # exists data
            assign = ExamCenterAssignment.objects.get(assign_id = id)
            
            assign = ExamCenterAssignmentSerializer(assign)
            
            return Response(
                {'assign': assign.data},
                status=status.HTTP_200_OK
            )
            
        return Response(
                {'type': 'warning', 'message': 'No existe asignación con este id'},
                status=status.HTTP_404_NOT_FOUND
            )



# list ExamCenterAssigment
class ListExamCenterAssigmentView(APIView):
    permission_classes = (permissions.AllowAny, )
    def get(self, request, format = None):
        
        if ExamCenterAssignment.objects.all().exists() == False:
            return Response(
                {'type':'warning', 'message': 'No hay fases registradas'},
                status = status.HTTP_204_NO_CONTENT 
            )
            
        sortBy = request.query_params.get('sortBy')
        
        if sortBy not in ['assign_id', 'announcement_id']:
            sortBy = 'assign_id'
            
        assigns = ExamCenterAssignment.objects.order_by(sortBy).all()
        assigns = ExamCenterAssignmentSerializer(assigns, many = True)
        if assigns:
            return Response(
                {'assigns': assigns.data},
                status= status.HTTP_200_OK
            )
            
        return Response(
            {'type':'warning', 'message': 'No se ha encontrado asignaciones'},
            status = status.HTTP_404_NOT_FOUND
        )
        




# Create ExamCenterAssigment
class CreateExamCenterAssigmentView(APIView):
    pass



# Update ExamCenterAssigment
class EditExamCenterAssigmentView(APIView):
    pass



# Delete ExamCenterAssigment
class DeleteExamCenterAssigmentView(APIView):
    pass



