from rest_framework.views import APIView
from django.db import models
from rest_framework.response import Response
from rest_framework import status, permissions
from django.db import transaction
from django.core.files.base import ContentFile
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Enrollment, EnrollmentSubjects, ChosenDegrees
from apps.institute.models import Institute
from apps.exam.serializers import EnrollmentSubjectsSerializer
from apps.institute.models import ExamCenterAssignment

from apps.student.models import Student
from apps.announcement.models import Announcement
from apps.subject.models import Subject
from apps.degree.models import Degree
from apps.grade.models import Grade

from .serializers import *
from core.utils import is_valid_number

# ------------------------------------------
#   ENROLLMENT API VIEWS
# --------------------------------------------.

class EnrollmentDetailView(APIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    def get(self, request, code, format=None):
        try:
            enrollment = Enrollment.objects.get(code=code)
            serializer = EnrollmentSerializer(enrollment)
            return Response(
                {'enrollment': serializer.data}, status=status.HTTP_200_OK
            )

        except Enrollment.DoesNotExist:
            return Response(
                {'type': 'warning', 'message': 'No existe matrícula con este código'},
                status=status.HTTP_404_NOT_FOUND
            )

class EnrollmentDocumentsView(APIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    def get(self, request, code, format=None):
        try:
            enrollment = Enrollment.objects.get(code=code)
            serializer = EnrollmentDocumentsSerializer(enrollment)
            return Response(
                {'enrollment': serializer.data}, status=status.HTTP_200_OK
            )

        except Enrollment.DoesNotExist:
            return Response(
                {'type': 'warning', 'message': 'No existe matrícula con este código'},
                status=status.HTTP_404_NOT_FOUND
            )

class ListEnrollmentsView(APIView):
    # permission_classes = (permissions.IsAuthenticated,)
    def get(self, request, format=None):

        announcement = request.query_params.get('announcement') or None
        
        if Enrollment.objects.all().exists() == False:
            return Response(
                {'type': 'warning', 'message': 'No existe matrículas'},
                status=status.HTTP_404_NOT_FOUND
            )
            
        if announcement == None:
            
            enrollments = Enrollment.objects.all()
            
            enrollments = EnrollmentSerializer(enrollments, many=True, context={'request': request})
            
            return Response(
                {'enrollments': enrollments.data }, 
                status=status.HTTP_200_OK
            )
            
            
        if Enrollment.objects.filter(announcement = announcement).exists():
            enrollments = Enrollment.objects.filter(announcement = announcement).all();
            enrollments = EnrollmentListSerializer(enrollments, many = True)
            return Response(
                {'enrollments': enrollments.data}, 
                status=status.HTTP_200_OK
            )
        
         
        return Response(
            {'type': 'warning', 'message': 'No existen matrículas'},
            status=status.HTTP_404_NOT_FOUND
        )
            
        
        
            
            
            
            

class ListStudentEnrollmentsView(APIView):
    permission_classes = (permissions.AllowAny,)
    def get(self, request, student , format=None):

        
        if Enrollment.objects.filter(student = student).exists():
            enrollments = Enrollment.objects.filter(student = student).all()
            
            #enrollments = EnrollmentSerializer(enrollments, many = True)
            enrollments = EnrollmentSerializer(enrollments, many=True, context={'request': request})

            data = enrollments.data            
            return Response(
                {'enrollments': data}, 
                status=status.HTTP_200_OK
            )
        
        else:
            
            return Response(
                {'type': 'warning', 'message': 'No existe matrículas para este alumno'},
                status=status.HTTP_404_NOT_FOUND
            )
            

class CheckStudentEnrolledInAnnouncementView(APIView):
    def get(self, request, format = None):
        student = request.query_params.get('student')
        announcement = request.query_params.get('announcement')
        
        if Enrollment.objects.filter(student = student, announcement = announcement).exists():
            enrollment = Enrollment.objects.get(student = student, announcement = announcement);
            return Response(
                {'exists': True, 'code': enrollment.code}, 
                status=status.HTTP_200_OK
            )
        
        return Response(
            {'exists': False, 'code': None}, 
            status=status.HTTP_200_OK
        )
        

class ListInstituteEnrollmentsView(APIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    def get(self, request, code, format=None):
        try:
            
            user = self.request.user

            institute = Institute.objects.get(pk=code)
            
            enrollments = Enrollment.objects.filter(student__institute=institute)  
            serializer = EnrollmentSerializer(enrollments, many=True)
            
            return Response(
                {'enrollments': serializer.data}, 
                status=status.HTTP_200_OK
            )
                

        
        except Institute.DoesNotExist:
            return Response(
                {'type': 'warning', 'message': 'No existe instituto con este codigo'},
                status=status.HTTP_404_NOT_FOUND
            ) 
            

class StudentEnrollmentExams(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, student, format=None):
        try:
            enrollments = EnrollmentSubjects.objects.filter(enrollment__student_id=student)
            if not enrollments.exists():
                return Response(
                    {'type': 'error', 'message': 'No se encontraron matrículas para el estudiante'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            exams_data = EnrollmentSubjectsSerializer(enrollments, many=True).data
            
            return Response(
                {'exams': exams_data},
                status=status.HTTP_200_OK
            )
            
        except EnrollmentSubjects.DoesNotExist:
            return Response(
                {'type': 'error', 'message': 'No se encontraron asignaturas de matrícula para el estudiante'},
                status=status.HTTP_404_NOT_FOUND
            )

class EnrollmentExams(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, code, format=None):
        try:
            enrollment = Enrollment.objects.filter(code=code)
            if not enrollment.exists():
                return Response(
                    {'type': 'error', 'message': 'No se encontraron resultados'},
                    status=status.HTTP_404_NOT_FOUND
                )
            enrollment = Enrollment.objects.get(code=code)
            exams_data = EnrollmentExamSerializer(enrollment, many = False).data
            
            return Response(
                {'exams': exams_data},
                status=status.HTTP_200_OK
            )
            
        except Enrollment.DoesNotExist:
            return Response(
                {'type': 'error', 'message': 'No se encontraron datos'},
                status=status.HTTP_404_NOT_FOUND
            )
            
            
class CreateEnrollmentView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    def post(self, request, format=None):
        parser_classes = [MultiPartParser, FormParser]
        
        required_fields = ['code', 'announcement', 'student', 'degrees', 'proof_of_payment', 'copy_id_card', 'subjects']
        
        data = request.data
        
        for field in required_fields:
            if field not in data:
                return Response(
                        
                    {'type': 'error', 'message': f'El campo {field} es requerido'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # validate list
            if  isinstance(data[field], list) and len(data[field]) == 0:
                return Response(
                    {'type': 'error', 'message': f'El campo {field} debe ser una lista con elementos'},
                    status=status.HTTP_400_BAD_REQUEST
            )
                
                
        # data
        code = data['code']
        student_id = data['student']
        student = get_object_or_404(Student, pk = student_id)
        degrees = data['degrees'] # array of degrees
        degrees = degrees.split(',') if degrees else []
        
        subjects = data['subjects']
        subjects = subjects.split(',') if subjects else []

        # if true: subjects array lenght must be at least 3
        general_phase = data.get('general_phase', '').lower() == 'true'
         # if true: subjects array len must be at least 2
        specific_phase = data.get('specific_phase', '').lower() == 'true'
        
        announcement_id = data['announcement']
        announcement = get_object_or_404(Announcement, pk = announcement_id)
        
        id_card_file = data['copy_id_card'] # file
        proof_payment_file = data['proof_of_payment']
                  
        # Check number of subjects based on selected phases            
              
        if general_phase and len(subjects) != 3 and not specific_phase :
            
            return Response(
                {'type': 'error', 'message': 'Debe seleccionar 3 asignaturas para la fase general'},
                status=status.HTTP_400_BAD_REQUEST
            )

        elif specific_phase and len(subjects) != 2 and not general_phase:
            return Response(
                {'type': 'error', 'message': 'Debe seleccionar 2 asignaturas para la fase específica'},
                status=status.HTTP_400_BAD_REQUEST
            )
        elif specific_phase and general_phase and len(subjects) != 5:
            return Response(
                {'type': 'error', 'message': 'El máximo de asignaturas a examinar es 5'},
                status=status.HTTP_400_BAD_REQUEST
            )


        # Check if enrollment code already exists
        if Enrollment.objects.filter(code=code).exists():
            return Response(
                {'type': 'error', 'message': 'El código de matrícula ya existe'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
            
        # Assign student exam classroom based on student's college assigned exam centers in the current announcement
        institute = student.institute
        exam_center_assignments = ExamCenterAssignment.objects.filter(
            institute_id=institute, 
            announcement_id=announcement
        )

        assigned_exam_class_room = None  # Variable para almacenar la sala de examen asignada

        for exam_center_assignment in exam_center_assignments:
            # Obtener el total de plazas asignadas en la sala para el insitutito del alumno
            asigned_seats = exam_center_assignment.seats
            
            # Obtener las matrículas asignadas a la misma sala de examen y convocatoria que sean del mismo instituto. De este modo tendremos el espacio actual ocupado para este instituto en esa sala
            assigned_enrollments = Enrollment.objects.filter(
                exam_class_room=exam_center_assignment.classroom_id,
                announcement=exam_center_assignment.announcement_id,
                student__institute=institute
            )
            
            # Calcular el total de plazas ocupadas por las matrículas existentes del instituto
            occupied_seats = assigned_enrollments.count()
            
            # Calcular las plazas disponibles restando el total de plazas asignadas a la capacidad de la sala
            available_seats = asigned_seats - occupied_seats
            
            
            if available_seats > 0:
                assigned_exam_class_room = exam_center_assignment.classroom_id
                
                break  # Salir del bucle, ya que se ha encontrado una plaza disponible
            
            """         if not exam_class_room: #
            
            raise ValueError("No hay plazas disponibles en las salas de examen asignadas al instituto del alumno") """

            """         # Asignar la sala de examen al alumno
                    enrollment.exam_class_room = exam_class_room """


        
        # Create the enrollment and related objects within a transaction
        with transaction.atomic():
            enrollment = Enrollment(
                code = data['code'],
                enrollment_date= timezone.now(),
                announcement = announcement,
                student = student,
                price = 4500,
                copy_id_card = id_card_file,
                proof_of_payment = proof_payment_file,
                status = 1, # formalizada
                status_id_card = 0, # no validadado
                status_proof_payment = 0, # no validado
                exam_class_room = assigned_exam_class_room
                
            )
            
            enrollment.full_clean()
            
            try:
                enrollment.save()
                
                # Add subjects to the enrollment
                for subject_id in subjects:
                    subject = get_object_or_404(Subject, pk=subject_id)
                    enrollment_subject = EnrollmentSubjects(enrollment=enrollment, subject=subject)
                    enrollment_subject.save()
                
                # Add degrees to the enrollment
                for degree_id in degrees:
                    degree = get_object_or_404(Degree, pk=degree_id)
                    ChosenDegrees.objects.create(
                        enrollment=enrollment, 
                        degree=degree
                    )
                
                return Response(
                    {'type': 'success', 'message': 'Matrícula creada exitosamente'},
                    status=status.HTTP_201_CREATED
                )
                
            except Exception as e:
                print(e)
                # Handle
                # Return an error response
                return Response(
                    {'type': 'error', 'message': 'Error al crear la matrícula'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )



class AddEnrollmentGrades(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    def post(self, request, format=None):
        data = request.data
        exams = data.get('exams', {})

        enrollment_code = data.get('enrollment')  # Código de matrícula correspondiente
        enrollment = get_object_or_404(Enrollment, pk=enrollment_code)
        
        # announcement = data.get('announcement')
        
        try:
            # Elimina las notas existentes para la matrícula
            Grade.objects.filter(enrollment=enrollment).delete()
            
            # Recorre los exámenes y guarda las notas
            for exam_id, grade in exams.items():
                # Crea una nueva instancia de Grade y guarda los datos
                exam = get_object_or_404(Exam, pk=exam_id)
                grade_obj = Grade(
                    enrollment=enrollment,
                    exam_id=exam,
                    grade=grade
                )
                grade_obj.save()
            
            return Response({'message': 'Notas guardadas correctamente'}, 
                            status=status.HTTP_201_CREATED)
        
        except Exception as e:
            print(e)
            # Handle
            # Return an error response
            return Response(
                {'type': 'error', 'message': 'Error durante el proceso de grabado de notas'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
