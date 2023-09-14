from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.utils import timezone

from .models import Announcement
from .serializers import *
from core.utils import is_valid_number
from apps.enrollment.models import Enrollment
from apps.student.models import Student
from apps.institute.models import Institute

#***************************************************
#   ANNOUNCEMENT API VIEWS
#***************************************************

class ListStudentAnnouncementView(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, student_id, format=None):
        try:
            student = Student.objects.get(pk=student_id)
            enrollments = Enrollment.objects.filter(student=student)
            announcements = [enrollment.announcement for enrollment in enrollments]
            serializer = AnnouncementSerializer(announcements, many=True)
            return Response(
                {'announcements': serializer.data}, 
                status=status.HTTP_200_OK
            )
            #return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Student.DoesNotExist:
            return Response(
                {'type': 'warning', 'message': 'No el alumno no existe'},
                status=status.HTTP_404_NOT_FOUND
            )


class ListInstituteAnnouncementView(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, code, format=None):
        try:
            institute = Institute.objects.get(pk=code)
            
            enrollments = Enrollment.objects.filter(student__institute=institute).distinct('announcement')
            
            announcements = [enrollment.announcement for enrollment in enrollments]
            
            serializer = AnnouncementSerializer(announcements, many=True)
            
            return Response(
                {'announcements': serializer.data}, 
                status=status.HTTP_200_OK
            )
        
        except Institute.DoesNotExist:
            return Response(
                {'type': 'warning', 'message': 'No existe instituto con este codigo'},
                status=status.HTTP_404_NOT_FOUND
            )        
        

class ListOpenAnnouncementView(APIView):
    permission_classes = (permissions.IsAuthenticated, )
    
    def get(self, request, format=None):
        now = timezone.now()
        # user = request.user
        user = self.request.user 
        if user.rol == 'student':
            # the annoucement open: enrollment_start >= now and enrollment_end <= now
            announcement = Announcement.objects.filter(
                enrollment_start__lte=now,
                enrollment_end__gte=now
            )
            
                
        elif user.rol == 'institute_staff':
                announcement = Announcement.objects.filter(
                    list_submision_start__lte=now,
                    list_submision_end__gte=now,
                )
        elif user.rol in ['admin_staff', 'staff']:
            announcement = Announcement.objects.filter(
                list_submision_start__lte=now,
                enrollment_end__gte=now,
                )
            
            

        if announcement.exists():
            serializer = AnnouncementSerializer(announcement, many=True)
            return Response({'announcement': serializer.data}, status=status.HTTP_200_OK)
        
        return Response({'type': 'warning', 'message': 'No hay convocatorias abiertas'}, status=status.HTTP_204_NO_CONTENT)


# GET SINGLE ANNOUNCEMENT
class AnnouncementDetailView(APIView):
    permission_classes = (permissions.AllowAny, )
    def get(self, request, id, format = None):
        if is_valid_number(id) == False:
            return Response(
                {'error': 'El id tiene que ser un número entero'},
                status = status.HTTP_400_BAD_REQUEST
            )
        
        if Announcement.objects.filter(announcement_id = id).exists():
            
            # exists data
            announcement = Announcement.objects.get(announcement_id = id)
            announcement = AnnouncementSerializer(announcement)
            
            return Response(
                {'announcement': announcement.data},
                status=status.HTTP_200_OK
            )
            
        return Response(
                {'type': 'error', 'message': 'No existe convocatoria con este id'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    
# GET LIST OF ANNOUNCEMENT
class ListAnnouncementView(APIView):
    permission_classes = (permissions.AllowAny, )
    def get(self, request, format = None):
        if Announcement.objects.all().exists() == False:
            return Response(
                {'type':'warning', 'message': 'No hay convocatorias registradas'},
                status = status.HTTP_204_NO_CONTENT 
            )
            
        sortBy = request.query_params.get('sortBy')
        
        if sortBy not in ['announcement_id', 'name']:
            sortBy = 'announcement_id'
            
        announcements = Announcement.objects.order_by(sortBy).all()
        announcements = AnnouncementSerializer(announcements, many = True)
        if announcements:
            return Response(
                {'announcements': announcements.data},
                status= status.HTTP_200_OK
            )
            
        return Response(
            {'type':'warning', 'message': 'No se ha encontrado convocatorias'},
            status = status.HTTP_404_NOT_FOUND
        )



       
    
# CREATE ANNOUNCEMENT
class CreateAnnouncementView(APIView):
    permission_classes = (permissions.AllowAny, )
    
    def post(self, request, format = None):
        announcement = AnnouncementSerializer(data = request.data)
        
        if announcement.is_valid():
            announcement.save()
            return Response(
                {'type':'success', 'message': 'Convocatoria registrada correctamente'},
                status = status.HTTP_200_OK
            )
            
        return Response(
            announcement.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

  
# UPDATE ANNOUNCEMENT
class EditAnnouncementView(APIView):
    permission_classes = (permissions.AllowAny, )
    
    def put(self, request, format = None):
        validate = AnnouncementSerializer(data = request.data)
        
        if validate.is_valid() == False:
            return Response(
                validate.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # ok valid data
        data = self.request.data
        
        # check if exists recodor don id
        if Announcement.objects.filter(announcement_id = data['announcement_id']).exists() == False:
            return Response(
                {'type': 'error', 'message': 'No existe convocatoria con este id'},
                status=status.HTTP_404_NOT_FOUND
            )
            
        #ok, record exists, make updates
        announcement = Announcement.objects.get(announcement_id = data['announcement_id'])
        
        announcement.name = data['name']
        announcement.list_submision_start = data['list_submision_start']
        announcement.list_submision_end = data['list_submision_end']
        announcement.enrollment_start = data['enrollment_start']
        announcement.enrollment_end = data['enrollment_end']
        announcement.grades_publication = data['grades_publication']
        
        announcement.save()
        
        return Response(
            {'type': 'success', 'message': 'Datos actualizados correntamente'}, 
            status=status.HTTP_200_OK
        )
 
        
             
    
# DELETE ANNOUNCEMENT
class DeleteAnnouncementView(APIView):
    
    permission_classes = (permissions.AllowAny, )
    
    def delete(self, request, id, format = None):
        if is_valid_number(id) == False:
            return Response(
                {'type': 'error','message': 'El id  tiene que ser un número entero'},
                status = status.HTTP_400_BAD_REQUEST
            )
            
        if Announcement.objects.filter(announcement_id = id).exists() == False:
            return Response(
                {'type': 'error','message': 'No existe esta convocatoria'},
                status = status.HTTP_404_NOT_FOUND
            )
        
        
        announcement = Announcement.objects.get(announcement_id = id)
        announcement.delete()
        
        return Response(
            {'type': 'success', 'message': 'Convocatoria eliminada'}, 
            status = status.HTTP_200_OK
        )
