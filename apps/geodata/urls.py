from django.urls import path

from .views import * # <<ListProvinceView, ListDistrictView, ProvinceDetailView, DistrictDetailView

urlpatterns = [
    # provinces
    path('provinces', ListProvinceView.as_view()),
    path('provinces/<id>', ProvinceDetailView.as_view()),
    path('provinces/create/', CreateProvinceView.as_view()),
    path('provinces/update/', EditProvinceView.as_view()),
    path('provinces/delete/<id>', DeleteProvinceView.as_view()),
    
    # district
    path('districts', ListDistrictView.as_view()),
    path('districts/<id>', DistrictDetailView.as_view()),
]