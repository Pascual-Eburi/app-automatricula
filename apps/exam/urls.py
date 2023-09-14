# File urls
from django.urls import path

from .views import *

urlpatterns = [
    # end points Examns
    #path('', ListExamView.as_view()),
    path('', ListStudentsExamsView.as_view()),
    path('<id>', ExamDetailView.as_view()),
    path('create', CreateExamView.as_view()),
    path('update', EditExamView.as_view()),
    path('delete/<id>', DeleteExamView.as_view()),
    path('student/<student>', StudentEnrollmentExams.as_view(), name='student-exams'),
    path('institute/<institute>', ListInstituteStudentExam.as_view(), name='institute-exams'),
    
    # Exam Center
    path('examcenter/', ListExamCenterView.as_view()),
    path('examcenter/<center_id>/classroom/', ListClassroomView.as_view()),
    path('examcenter/<id>', ExamCenterDetailView.as_view()),
    path('examcenter/create', CreateExamCenterView.as_view()),
    path('examcenter/update', EditExamCenterView.as_view()),
    path('examcenter/delete/<id>', DeleteExamCenterView.as_view()),
    
    # Exam Center classrooms
    path('examcenter/classroom/<id>', ClassroomDetailView.as_view()),
    path('examcenter/classroom/create/', CreateClassroomView.as_view()),
    path('examcenter/classroom/update/', EditClassroomView.as_view()),
    path('examcenter/classroom/delete/<id>', DeleteClassroomView.as_view()),
    
]

