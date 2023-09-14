# File urls
# File urls
from django.urls import path

from .views import * 


urlpatterns = [
    # end points
    path('', ListDegreeView.as_view()),
    path('<id>', DegreeDetailView.as_view()),
    path('create', CreateDegreeView.as_view()),
    path('update', EditDegreeView.as_view()),
    path('delete/<id>', DeleteDegreeView.as_view()),
    
]