from django.db import models
from django.conf import settings
from apps.institute.models import Institute
User = settings.AUTH_USER_MODEL

"""
table personal_instituto{
  id_usuario integer [primary key]
  tipo_documento varchar(20)
  numero_documento varchar(10)
  cargo varchar(10)
  codigo_instituto integer [not null]

}

"""
def staff_photo_directory(instance, filename):
    return 'img/staff/{0}/{1}'.format(instance.user, filename)

 
    
class InstituteStaff(models.Model):
    class Meta:
        verbose_name = 'Personal Instituto'
        verbose_name_plural = 'Personal Institutos'
    
    job_titles = (
        ('secretario', 'Secretario/a'),
        ('director', 'Director/a'),
    )
    
    doc_types = (
        ('dip', 'DIP'),
        ('pasaporte', 'Pasaporte'),
        ('otro', 'Otro') 
    )
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    photo = models.ImageField(upload_to=staff_photo_directory, blank=True, null=True, max_length=500)
    
    institute = models.ForeignKey(Institute, on_delete=models.RESTRICT)    
    doc_type = models.CharField(max_length=20, choices=doc_types, default='dip')
    doc_number = models.CharField(max_length=10)
    job_title = models.CharField(max_length=30, default='Secretario')
    

    def __str__(self):
        return f'{self.user.name} {self.user.last_name}'