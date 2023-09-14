# File urls
from django.urls import path

from .views import * 


urlpatterns = [
    # end points
    path('', ListPhaseView.as_view()),
    path('<id>', PhaseDetailView.as_view()),
    path('create', CreatePhaseView.as_view()),
    path('update', EditPhaseView.as_view()),
    path('delete/<id>', DeletePhaseView.as_view()),
    
]
