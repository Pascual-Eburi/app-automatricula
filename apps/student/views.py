from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.db import transaction
from django.core.files.base import ContentFile
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser
from .models import *
from apps.user.models import UserAccount
from apps.institute.models import Institute
from apps.modality.models import Modality
from apps.geodata.models import District


from .serializers import StudentSerializer

from core.utils import is_valid_number

class StudentDetailView(APIView):
    permission_classes = (permissions.IsAuthenticated, )
    
    def get(self, request, id, format = None):
        # validate id
        if is_valid_number(id) == False:
            return Response(
                {'type': 'error', 'message': 'El id tiene que ser un número'},
                status = status.HTTP_400_BAD_REQUEST
            )
        
            
        # check if the institute exists
        if Student.objects.filter(user = id).exists():
   
            # ok, the institute exits --> serialize
            student = Student.objects.get(user = id)
            student = StudentSerializer(student)
            
            return Response(
                {'student': student.data}, 
                status=status.HTTP_200_OK
            )
            
        else:
            return Response(
                {'type': 'warning', 'message': 'No existe alumno con este codigo'},
                status=status.HTTP_404_NOT_FOUND
            )

class ListStudentView(APIView):
    permission_classes = (permissions.IsAuthenticated, )

    def get(self, request, institute=None, format=None):
        user = request.user
        rol = user.rol or None
        allowed_roles = ['institute_staff', 'admin_staff', 'staff']

        if rol not in allowed_roles:
            return Response(
                {'type': 'error', 'message': 'No tiene permiso para acceder a este recurso'},
                status=status.HTTP_401_UNAUTHORIZED
            ) 

        if institute:
            students = Student.objects.filter(institute__code=institute)
        else:
            students = Student.objects.all()

        if not students.exists():
            return Response(
                {'students': []},
                status=status.HTTP_204_NO_CONTENT
            )

        sortBy = request.query_params.get('sortBy')

        if sortBy not in ['user', 'dob']:
            sortBy = 'user'

        students = students.order_by(sortBy)
        students = StudentSerializer(students, many=True)

        return Response(
            {'students': students.data},
            status=status.HTTP_200_OK
        )



""" class ListStudentView(APIView):
    permission_classes = (permissions.IsAuthenticated, )
    def get(self, request, institute = None,  format = None):
        user = request.user
        rol = user.get('rol') or None
        allowed_roles = ['institute_staff', 'admin_staff', 'staff']
        
        if rol not in allowed_roles:
            return Response(
                {'type':'error', 'message': 'No tiene permiso para acceder a este recurso'},
                status = status.HTTP_401_UNAUTHORIZED
            )
            
            
        if Student.objects.all().exists() == False:
            return Response(
                {'students': []},
                status = status.HTTP_204_NO_CONTENT
            )
        
        sortBy = request.query_params.get('sortBy')
        
        if sortBy not in ['user', 'dob']:
            sortBy = 'user'
        
        # ordering
        # limit

        students = Student.objects.order_by(sortBy).all()
        
        students = StudentSerializer(students, many = True)
        
        if students:
            return Response(
                {'students': students.data},
                status = status.HTTP_200_OK
            )
        else:
            return Response(
                {'type':'warning', 'message': 'No se ha encontrado alumnos'},
                status = status.HTTP_404_NOT_FOUND
            )
            

 """
class StudentAddView(APIView):
    permission_classes = (permissions.IsAuthenticated, )
    def post(self, request, format=None):
        parser_classes = [MultiPartParser, FormParser]
        
        required_fields = ['user', 'photo', 'student_school_report', 'dob', 'institute', 'village', 'gender', 'high_school_grade', 'modality', 'doc_type', 'doc_number', 'address']
        
        data = request.data
        
        for field in required_fields:
            if field not in data:
                if 'user' in data:
                    UserAccount.objects.filter(id=data['user']).delete()
                    
                return Response(
                        
                    {'type': 'error', 'message': f'El campo {field} es requerido'},
                    status=status.HTTP_400_BAD_REQUEST
                )


        
        user_id = data['user']
        user = get_object_or_404(UserAccount, id=user_id)   
        photo_file = data['photo']
        report_file = data['student_school_report']
        #report_content_file = ContentFile(report_file)
        
        dob = data['dob']
        institute_id = data['institute']
        institute = get_object_or_404(Institute, pk=institute_id) 
        village = data['village']
        gender = data['gender']
        high_school_grade = data['high_school_grade']
        modality_id = data['modality']
        modality = get_object_or_404(Modality, pk=modality_id)
        district_id = data['district']
        district = get_object_or_404(District, pk=district_id) 
        doc_type = data['doc_type']
        doc_number = data['doc_number']
        address = data['address']

        try:
            student = Student(
                user=user, photo=photo_file, school_report=report_file, dob=dob, institute=institute, village=village, 
                district=district,gender=gender, high_school_grade=high_school_grade, modality=modality, doc_type=doc_type, doc_number=doc_number, address=address)
            student.full_clean()  # Perform model validation

            with transaction.atomic():
                # Save student instance
                student.save()

                # If everything is successful, return success response
                return Response(
                    {'type': 'success', 'message': 'Alumno preinscrito correctamente'},
                    status=status.HTTP_201_CREATED
                )
        except Exception as e:
            print(e)
            # Handle exception and delete the associated user
            if 'user' in data:
                print('eliminando')
                UserAccount.objects.filter(id=user_id).delete()
            
            return Response(
                {'type': 'error', 'message': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

