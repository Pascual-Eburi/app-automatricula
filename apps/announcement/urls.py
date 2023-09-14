# File urls
from django.urls import path

from .views import * # <<ListProvinceView, ListDistrictView, ProvinceDetailView, DistrictDetailView


urlpatterns = [
    # end points
    path('open', ListOpenAnnouncementView.as_view()), # return the open announcment based on user
    path('student/<student_id>', ListStudentAnnouncementView.as_view()),
    path('institute/<code>', ListInstituteAnnouncementView.as_view()),   
    
    path('announcements', ListAnnouncementView.as_view()),
    path('announcements/<id>', AnnouncementDetailView.as_view()),
    path('create', CreateAnnouncementView.as_view()),
    path('update', EditAnnouncementView.as_view()),
    path('delete/<id>', DeleteAnnouncementView.as_view()),
    
]