# File urls
# File urls
from django.urls import path

from .views import * 


urlpatterns = [
    # end points
    path('enrollments', ListEnrollmentsView.as_view()),
    path('exams/<code>', EnrollmentExams.as_view()),
    path('grades/add/', AddEnrollmentGrades.as_view()),
    path('student/<student>', ListStudentEnrollmentsView.as_view()), 
    path('institute/<code>', ListInstituteEnrollmentsView.as_view()), 
    path('<code>', EnrollmentDetailView.as_view()),
    path('check/', CheckStudentEnrolledInAnnouncementView.as_view()),
    path('create/', CreateEnrollmentView.as_view()),
    path('documents/<code>', EnrollmentDocumentsView.as_view())
    #path('announcements', ListAnnouncementView.as_view()),
    #path('announcements/<id>', AnnouncementDetailView.as_view()),
    #path('create', CreateAnnouncementView.as_view()),
    #path('update', EditAnnouncementView.as_view()),
    #path('delete/<id>', DeleteAnnouncementView.as_view()),
    
]