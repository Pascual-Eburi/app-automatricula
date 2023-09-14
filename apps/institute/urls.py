from django.urls import path

from .views import * #ListInstituteView, InstituteDetailView

urlpatterns = [
    path('institutes', ListInstituteView.as_view()),
    path('institutes/<id>', InstituteDetailView.as_view()),
    
    # ExamCenterAsigment
    path('assigment', ListExamCenterAssigmentView.as_view()),
    path('assigment/<id>', ExamCenterAssigmentDetailView.as_view()),
    path('assigment/create', CreateExamCenterAssigmentView.as_view()),
    path('assigment/update', EditExamCenterAssigmentView.as_view()),
    path('assigment/delete/<id>', DeleteExamCenterAssigmentView.as_view()),
    
    

]