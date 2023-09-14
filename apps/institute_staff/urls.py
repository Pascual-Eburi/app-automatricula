# File urls
from django.urls import path

from .views import *


urlpatterns = [
    # end points
    path('<id>', InstituteStaffDetailView.as_view()), 
    path('add/', AddInstituteStaffView.as_view()), 
    path('', ListInstituteStaffView.as_view()), 
  
]