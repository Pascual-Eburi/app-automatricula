from django.db import models
from apps.subject.models import Subject
from apps.announcement.models import Announcement
from apps.geodata.models import District

# Create your models here.
"""
table examenes {
  id_examen integer [primary key]
  codigo_asignatura integer [not null]
  id_convocatoria integer
  fecha date
  hora_inicio time
  hora_fin time
}

"""
class Exam(models.Model):
    class Meta:
        verbose_name = 'Examen'
        verbose_name_plural = 'Exámenes'
        # make not repeteable
        unique_together = ('subject_id', 'announcement_id',)
        
    exam_id = models.AutoField(verbose_name='codigo', primary_key=True)
    exam_date = models.DateField(verbose_name='Fecha', blank=False, null=False)
    start_time = models.TimeField(verbose_name='Hora inicio', blank=False, null=False)
    end_time = models.TimeField(verbose_name='Hora fin', blank=False, null=False)
    subject_id = models.ForeignKey(
        Subject,
        on_delete=models.RESTRICT,
        verbose_name='id asignatura'
    )
    
    announcement_id = models.ForeignKey(
        Announcement,
        on_delete=models.RESTRICT,
        verbose_name='Id convocatoria'
    )
    
    def name(self):
        return self.__str__()
    
    def __str__(self):
        return self.subject_id.name +' - '+ self.announcement_id.name
    

"""
    table centro_examen {
    id_centro integer [primary key]
    nombre varchar(50)
    direccion text
    id_distrito integer
    }
"""

class ExamCenter(models.Model):
    class Meta:
        verbose_name = 'Centro de Examen'
        verbose_name_plural = 'Centros de Examenes'
    
    
    center_id = models.AutoField(verbose_name='Id', primary_key=True)
    name = models.CharField(verbose_name='Nombre', max_length=100, unique=True, blank=False, null=False)
    address = models.CharField(verbose_name='Dirección', max_length=255,  blank=True, null=True)
    district_id = models.ForeignKey(
        District, on_delete=models.RESTRICT,
        verbose_name='Id distrito'   
    )
    
    def __str__(self):
        return self.name.title()
 
 
 
"""
    table salas {
    id_sala integer [primary key]
    nombre varchar(50)
    capacidad integer [default: 0]
    id_ubicacion integer
    //ubicacion text [note: 'Lugar donde se realiza el examen']
    } 
 
"""   
    
class Classroom(models.Model):
    class Meta:
        verbose_name = 'Aula'
        verbose_name_plural = 'Aulas'
        
    classroom_id = models.AutoField(verbose_name='Id', primary_key=True)
    name = models.CharField(verbose_name='nombre', max_length=100, unique=True, blank=False, null=False)
    capacity = models.PositiveIntegerField(verbose_name='Capacidad', blank=False, null=False, default=0)
    center_id = models.ForeignKey(
        ExamCenter, on_delete=models.CASCADE,
        verbose_name='Centro'   
    )
    
    
    def __str__(self):
        return f'{self.name} - {self.center_id.name.title()} - ({self.capacity} Plazas)'
    

