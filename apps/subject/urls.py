# File urls
from django.urls import path

from .views import * 


urlpatterns = [
    # end points Subject
    path('', ListSubjectView.as_view()),
    path('<id>', SubjectDetailView.as_view()),
    path('create', CreateSubjectView.as_view()),
    path('update', EditSubjectView.as_view()),
    path('delete/<id>', DeleteSubjectView.as_view()),
    
    # end points Category Subject
    path('category/', ListCategoryView.as_view()),
    path('category/<id>', CategoryDetailView.as_view()),
    path('category/create', CreateCategoryView.as_view()),
    path('category/update', EditCategoryView.as_view()),
    path('category/delete/<id>', DeleteCategoryView.as_view()),
    
]
