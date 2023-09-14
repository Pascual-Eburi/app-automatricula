"""core URL Configuration
('blog/', include('blog.urls'))
"""
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    # DJOSER AUTH end-points
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    
    path('api/geodata/', include('apps.geodata.urls')),
    path('api/institute/', include('apps.institute.urls')),
    path('api/announcement/', include('apps.announcement.urls')),
    path('api/modality/', include('apps.modality.urls')),
    path('api/phase/', include('apps.phase.urls')),
    path('api/subject/', include('apps.subject.urls')),
    path('api/degree/', include('apps.degree.urls')),
    path('api/exam/', include('apps.exam.urls')),
    path('api/students/', include('apps.student.urls')),
    path('api/institute/staff/', include('apps.institute_staff.urls')),
    path('api/users/staff/', include('apps.user.urls')),
    

    path('api/enrollment/', include('apps.enrollment.urls')),
    
    path('admin/', admin.site.urls),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [
    re_path(
        r'^.*',
        TemplateView.as_view(template_name='index.html')
    )]
