from django.db import models
from django.conf import settings
from apps.geodata.models import District
from apps.institute.models import Institute
from apps.modality.models import Modality
User = settings.AUTH_USER_MODEL

"""
Table alumnos {
  id_usuario integer [primary key]
  foto text
  fecha_nacimiento date [not null]
  id_instituto integer [null]
  pueblo varchar(50) [not null]
  hoja_academica text [not null]
  sexo char(1) [not null]
  media_bachillerato decimal
  id_modalidad integer [not null]
  tipo_documento varchar(30) [not null]
  numero_documento integer [not null]

}

"""
def student_photo_directory(instance, filename):
    return 'img/students/{0}/{1}'.format(instance.user, filename)

def school_report_directory(instance, filename):
    return f'school_reports/{instance.user}/{filename}'   
    
class Student(models.Model):
    class Meta:
        verbose_name = 'Alumno'
        verbose_name_plural = 'Alumnos'
    
    genders = (
        ('masculino', 'Masculino'),
        ('femenino', 'Femenino'),
    )
    
    doc_types = (
        ('dip', 'DIP'),
        ('dni', 'DNI'),
        ('pasaporte', 'Pasaporte'),
        ('otro', 'Otro') 
    )
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    photo = models.ImageField(upload_to=student_photo_directory, blank=True, null=True, max_length=500)
    
    dob = models.DateField(blank=False, null=False)
    institute = models.ForeignKey(Institute, on_delete=models.RESTRICT)
    
    village = models.CharField(blank=False, null=False, max_length=100)
    district = models.ForeignKey(District, on_delete=models.RESTRICT, null=True, blank=True)
    school_report = models.FileField(max_length=500, upload_to=school_report_directory)
    
    gender = models.CharField(max_length=10, choices=genders, default='masculino' )
    
    high_school_grade = models.DecimalField(max_digits=4,decimal_places=2)
    modality = models.ForeignKey(Modality, on_delete=models.RESTRICT)
    doc_type = models.CharField(max_length=20, choices=doc_types, default='dip')
    doc_number = models.CharField(max_length=10)
    address = models.TextField(blank=True, null=True, verbose_name="Direccion")

    def __str__(self):
        return self.user.name