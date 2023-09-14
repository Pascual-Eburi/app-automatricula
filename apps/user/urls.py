# File urls
from django.urls import path

from .views import *


urlpatterns = [
    # end points
    # path('<id>', InstituteStaffDetailView.as_view()), 
    path('add/', AddStaffUserView.as_view()), 
    path('', ListUserView.as_view()), 
  
]