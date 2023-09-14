# File urls
from django.urls import path

from .views import * 


urlpatterns = [
    # end points
    path('modalities', ListModalityView.as_view()),
    path('modalities/<id>', ModalityDetailView.as_view()),
    path('create', CreateModalityView.as_view()),
    path('update', EditModalityView.as_view()),
    path('delete/<id>', DeleteModalityView.as_view()),
    
]
