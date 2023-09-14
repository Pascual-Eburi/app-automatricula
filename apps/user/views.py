from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404

from apps.user.models import UserAccount
from .serializers import *

# Create your views here.

class ListUserView(APIView):
    permission_classes = (permissions.IsAuthenticated, )

    def get(self, request, format=None):
        user = request.user

        rol = user.rol or None
        allowed_roles = ['admin_staff', 'staff']

        if rol not in allowed_roles:
            return Response(
                {'type': 'error', 'message': 'No tiene permiso para acceder a este recurso'},
                status=status.HTTP_401_UNAUTHORIZED
            )  


        staff_users = UserAccount.objects.filter(rol__in=allowed_roles)

        if not staff_users.exists():
            return Response(
                {'type': 'error', 'message': 'No se ha encontrado personal'},
                status=status.HTTP_404_NOT_FOUND
            )

        sortBy = request.query_params.get('sortBy')

        if sortBy not in ['id',
            'email',
            'name',
            'last_name',
            'rol',
            'phone',
            'is_active',
            'is_staff',
            'is_superuser',
            'date_joined',
            'last_login',]:
            sortBy = 'id'

        staff_users = staff_users.order_by(sortBy)
        staff_users = UserCreateSerializer(staff_users, many=True)

        return Response(
            {'staff_users': staff_users.data},
            status=status.HTTP_200_OK
        )



class AddStaffUserView(APIView):
    permission_classes = (permissions.IsAuthenticated, )
    def post(self, request, format=None):

        
        required_fields = ['user', 'rol']
        allowed_roles = ['admin_staff']
        data = request.data
        user = request.user
        
        if user.rol not in allowed_roles:
            return Response(
                {'type': 'error', 'message': 'No tiene permisos para realizar esta accion'},
                status=status.HTTP_401_UNAUTORIZED
            )
        
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
        rol = data['rol']


        try:   
            # update user account
            user.rol = rol
            if rol == 'admin_staff':
                user.is_superuser = True
                user.is_staff = True
                
            if rol == 'staff':
                user.is_staff = True
                
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
