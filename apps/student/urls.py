# File urls
from django.urls import path

from .views import * #ListInstituteView, InstituteDetailView

urlpatterns = [
    path('', ListStudentView.as_view(), name='list-students'),
    path('<int:id>', StudentDetailView.as_view(), name='student-detail'),
    path('institute/<institute>', ListStudentView.as_view(), name='list-students-institute'),
    path('add/', StudentAddView.as_view(), name='add-student'),
]