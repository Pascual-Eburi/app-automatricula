from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from .models import Exam, ExamCenter, Classroom
from .serializers import *
from apps.enrollment.models import Enrollment
from apps.institute.models import Institute
from apps.student.models import Student

from core.utils import is_valid_number

#***************************************************
#   EXAM API VIEWS
#***************************************************
# Exam
class ExamDetailView(APIView):
    permission_classes = (permissions.AllowAny, )   
    def get(self, request, id, format = None):
        if is_valid_number(id) == False:
            return Response(
                {'type': 'error', 'message': 'El id tiene que ser un número entero'},
                status = status.HTTP_400_BAD_REQUEST
            )
        
        if Exam.objects.filter(exam_id = id).exists():
            
            # exists data
            exam = Exam.objects.get(exam_id = id)
            
            exam = ExamSerializer(exam)
            
            return Response(
                {'exam': exam.data},
                status=status.HTTP_200_OK
            )
            
        return Response(
                {'type': 'warning', 'message': 'No existe examen con este id'},
                status=status.HTTP_404_NOT_FOUND
            )



# Exam
class ListExamView(APIView):
    permission_classes = (permissions.AllowAny, )
    def get(self, request, format = None):
        
        if Exam.objects.all().exists() == False:
            return Response(
                {'type':'warning', 'message': 'No hay examenes registrados'},
                status = status.HTTP_204_NO_CONTENT 
            )
            
        sortBy = request.query_params.get('sortBy')
        
        if sortBy not in ['exam_id', 'announcement_id']:
            sortBy = 'exam_id'
            
        exams = Exam.objects.order_by(sortBy).all()
        exams = ExamSerializer(exams, many = True)
        if exams:
            return Response(
                {'exams': exams.data},
                status= status.HTTP_200_OK
            )
            
        return Response(
            {'type':'warning', 'message': 'No se ha encontrado exámenes'},
            status = status.HTTP_404_NOT_FOUND
        )
        
        
class ListStudentsExamsView(APIView):
    permissions = (permissions.IsAuthenticated,)
    def get (self, request, format = None):
        try:
            enrollments = EnrollmentSubjects.objects.all()
            if not enrollments.exists():
                return Response(
                    {'type': 'error', 'message': 'No se encontraron matrículas '},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            exams_data = EnrollmentSubjectsSerializer(enrollments, many=True).data
            
            return Response(
                {'exams': exams_data},
                status=status.HTTP_200_OK
            )
            
        except EnrollmentSubjects.DoesNotExist:
            return Response(
                {'type': 'error', 'message': 'No se encontraron asignaturas'},
                status=status.HTTP_404_NOT_FOUND
            )    


""" class ListInstituteStudentExam(APIView):
    permission_classes = (permissions.AllowAny, )
    def get(self, request,institute, format=None):
        #institute_code = request.query_params.get('institute')

        if not institute:
            return Response(
                {'type': 'error', 'message': 'Debe proporcionar el código del instituto'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            institute = Institute.objects.get(code=institute)
        except Institute.DoesNotExist:
            return Response(
                {'type': 'error', 'message': 'No se encontró ningún instituto con el código proporcionado'},
                status=status.HTTP_404_NOT_FOUND
            )

        students = Student.objects.filter(institute = institute)
        
        exams = Exam.objects.filter(subject_id__enrollment__student__in=students)
        if exams.exists():
            serializer = ExamSerializer(exams, many=True)
            return Response(
                {'exams': serializer.data},
                status=status.HTTP_200_OK
                ) """

class ListInstituteStudentExam(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, institute, format=None):
        try:
            enrollments = Enrollment.objects.filter(student__institute_id=institute)
            
            if not enrollments.exists():
                return Response(
                    {'type': 'error', 'message': 'No se encontraron matrículas para el centro'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            enrollment_subjects = EnrollmentSubjects.objects.filter(enrollment__in=enrollments)
            
            exams_data = EnrollmentSubjectsSerializer(enrollment_subjects, many=True).data
            
            return Response(
                {'exams': exams_data},
                status=status.HTTP_200_OK
            )
            
        except Enrollment.DoesNotExist:
            return Response(
                {'type': 'error', 'message': 'No se encontraron matrículas para el centro'},
                status=status.HTTP_404_NOT_FOUND
            )





class StudentEnrollmentExams(APIView):
    permission_classes = (permissions.IsAuthenticated, )

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

    


# Exam
class CreateExamView(APIView):
    pass

# Exam
class EditExamView(APIView):
    pass

# Exam
class DeleteExamView(APIView):
    pass


#***************************************************
#   EXAM CENTER API VIEWS
#***************************************************

# Get single ExamCenter
class ExamCenterDetailView(APIView):
    permission_classes = (permissions.AllowAny, )   
    def get(self, request, id, format = None):
        if is_valid_number(id) == False:
            return Response(
                {'type': 'error', 'message': 'El id tiene que ser un número entero'},
                status = status.HTTP_400_BAD_REQUEST
            )
        
        if ExamCenter.objects.filter(center_id = id).exists():  
            # exists data
            center = ExamCenter.objects.get(center_id = id)
            
            center = ExamCenterSerializer(center)
            
            return Response(
                {'center': center.data},
                status=status.HTTP_200_OK
            )
            
        return Response(
                {'type': 'warning', 'message': 'No existe centro con este id'},
                status=status.HTTP_404_NOT_FOUND
            )


# Get ExamCenter List
class ListExamCenterView(APIView):
    permission_classes = (permissions.AllowAny, )
    def get(self, request, format = None):
        
        if ExamCenter.objects.all().exists() == False:
            return Response(
                {'type':'warning', 'message': 'No hay centros de examenes registrados'},
                status = status.HTTP_204_NO_CONTENT 
            )
            
        sortBy = request.query_params.get('sortBy')
        
        if sortBy not in ['center_id', 'name']:
            sortBy = 'center_id'
            
        centers = ExamCenter.objects.order_by(sortBy).all()
        centers = ExamCenterSerializer(centers, many = True)
        if centers:
            return Response(
                {'centers': centers.data},
                status= status.HTTP_200_OK
            )
            
        return Response(
            {'type':'warning', 'message': 'No se ha encontrado exámenes'},
            status = status.HTTP_404_NOT_FOUND
        )
        


# Create ExamCenter
class CreateExamCenterView(APIView):
    pass

# Edit ExamCenter
class EditExamCenterView(APIView):
    pass

# Delete ExamCenter
class DeleteExamCenterView(APIView):
    pass



#***************************************************
#   EXAM CENTER CLASSROOMS API VIEWS
#***************************************************
# Classroom
class ClassroomDetailView(APIView):
    permission_classes = (permissions.AllowAny, )
    def get(self, request, id, format = None):
        if is_valid_number(id) == False:
            return Response(
                {'type': 'error', 'message':'El id tiene que ser un número entero'},
                status = status.HTTP_400_BAD_REQUEST
            )
        
        if Classroom.objects.filter(classroom_id = id).exists():
            
            # exists data
            classroom = Classroom.objects.get(classroom_id = id)
            classroom = ClassroomSerializer(classroom)
            
            return Response(
                {'classroom': classroom.data},
                status=status.HTTP_200_OK
            )
            
        return Response(
                {'type': 'error', 'message': 'No existe aula con este id'},
                status=status.HTTP_404_NOT_FOUND
            )


# Classroom
class ListClassroomView(APIView):
    permission_classes = (permissions.AllowAny, )
    def get(self, request, center_id = 0, format = None):
        # valid  center id

        if is_valid_number(center_id) == False:
            return Response(
                {'type': 'error', 'message':'El id tiene que ser un número entero'},
                status = status.HTTP_400_BAD_REQUEST
            )
        
        # confirm that exists clasrooms  
        if Classroom.objects.all().exists() == False:
            return Response(
                {'type':'warning', 'message': 'No hay aulas registradas'},
                status = status.HTTP_204_NO_CONTENT 
            )
            
        center_id = int(center_id)
        # confirm that the center id exists
        if center_id > 0:
            # make sure the center id exists
            if ExamCenter.objects.filter(center_id = center_id).exists() == False:  
                return Response(
                    {'type': 'warning', 'message': 'No existe centro con este id'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # make sure the center has classrooms
            if Classroom.objects.filter(center_id = center_id).exists() == False:
                return Response(
                    {'type': 'warning', 'message': 'No existe aulas para este centro'},
                    status=status.HTTP_404_NOT_FOUND
                ) 
        
        
          
        sortBy = request.query_params.get('sortBy')
        
        if sortBy not in ['classroom_id', 'name']:
            sortBy = 'classroom_id'
        
        
        if center_id > 0:  # get all center exam classroom         
            classrooms = Classroom.objects.filter(center_id = center_id).order_by(sortBy).all()
        else: # get all classrooms 
            classrooms = Classroom.objects.order_by(sortBy).all()
        
        classrooms = ClassroomSerializer(classrooms, many = True)
        
        if classrooms:
            return Response(
                {'classrooms': classrooms.data},
                status= status.HTTP_200_OK
            )
            
        return Response(
            {'type':'warning', 'message': 'No se ha encontrado aulas'},
            status = status.HTTP_404_NOT_FOUND
        )
   

# Classroom
class CreateClassroomView(APIView):
    pass

# Classroom
class EditClassroomView(APIView):
    pass

# Classroom
class DeleteClassroomView(APIView):
    pass


