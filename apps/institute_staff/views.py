from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.db import transaction
from django.core.files.base import ContentFile
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser
from apps.user.models import UserAccount
from apps.institute.models import Institute

from .models import InstituteStaff
from .serializers import *

from core.utils import is_valid_number

class InstituteStaffDetailView(APIView):
    permission_classes = (permissions.IsAuthenticated, )
    
    def get(self, request, id, format = None):
        # validate id
        if is_valid_number(id) == False:
            return Response(
                {'type': 'error', 'message': 'El id tiene que ser un número'},
                status = status.HTTP_400_BAD_REQUEST
            )
        
            
        # check if the institute staff exists
        try:
            staff = InstituteStaff.objects.select_related('institute').get(user=id)
        except InstituteStaff.DoesNotExist:
            return Response(
                {'type': 'warning', 'message': 'No existe personal con este id'},
                status=status.HTTP_404_NOT_FOUND
            )

        # serialize institute staff data
        staff_serializer = InstituteStaffSerializer(staff)

        return Response(
            {'staff_data': staff_serializer.data},
            status=status.HTTP_200_OK
        )

class ListInstituteStaffView(APIView):
    permission_classes = (permissions.IsAuthenticated, )

    def get(self, request, format=None):
        user = request.user
        
        rol = user.get('rol') or None
        allowed_roles = ['admin_staff', 'staff']

        if rol not in allowed_roles:
            return Response(
                {'type': 'error', 'message': 'No tiene permiso para acceder a este recurso'},
                status=status.HTTP_401_UNAUTHORIZED
            ) 


        instite_staff = InstituteStaff.objects.all()

        if not instite_staff.exists():
            return Response(
                {'type': 'error', 'message': 'No se ha encontrado personal'},
                status=status.HTTP_404_NOT_FOUND
            )

        sortBy = request.query_params.get('sortBy')

        if sortBy not in ['user']:
            sortBy = 'user'

        instite_staff = instite_staff.order_by(sortBy)
        instite_staff = ListInstituteStaffSerializer(instite_staff, many=True)

        return Response(
            {'instite_staffs': instite_staff.data},
            status=status.HTTP_200_OK
        )

class AddInstituteStaffView(APIView):
    permission_classes = (permissions.IsAuthenticated, )
    def post(self, request, format=None):
        parser_classes = [MultiPartParser, FormParser]
        
        required_fields = ['user', 'photo', 'institute', 'job_title', 'doc_type', 'doc_number']
        
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
        institute_id = data['institute']
        institute = get_object_or_404(Institute, pk=institute_id) 
        job_title = data['job_title']
        doc_type = data['doc_type']
        doc_number = data['doc_number']

        try:
            institute_staff = InstituteStaff(
                user=user, 
                photo=photo_file, 
                institute=institute, 
                job_title=job_title, 
                doc_type=doc_type, 
                doc_number=doc_number, 
                
            )
            institute_staff.full_clean()  # Perform model validation

            with transaction.atomic():
                # Save institute_staff instance
                institute_staff.save()
                
                # update user account
                user.rol = 'institute_staff'
                user.save()

                # If everything is successful, return success response
                return Response(
                    {'type': 'success', 'message': 'Personal registrado correctamente'},
                    status=status.HTTP_201_CREATED
                )
        except Exception as e:
            # Handle exception and delete the associated user
            if 'user' in data:
                print('eliminando')
                UserAccount.objects.filter(id=user_id).delete()
            
            return Response(
                {'type': 'error', 'message': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
