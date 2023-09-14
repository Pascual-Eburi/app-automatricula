from django.db import models
from apps.phase.models import Phase
from apps.modality.models import Modality


"""
  id_categoria integer [primary key]
  nombre varchar(30) [unique]
"""
class Category(models.Model):
    class Meta:
        verbose_name = 'Categoria'
        verbose_name_plural = 'Categorias'
        
        
    category_id = models.AutoField(verbose_name='Id',primary_key=True)
    name = models.CharField(verbose_name='Nombre', unique=True, null=False, blank=False, max_length=30)
    
    def __str__(self):
        return self.name



"""
  id_asignatura integer [primary key]
  nombre varchar(40) [unique]
  id_categoria integer [null]
  id_fase integer [not null]
  id_modalidad integer [not null]

"""
# Create your models here.
class Subject(models.Model):
    class Meta:
        verbose_name = 'Asignatura'
        verbose_name_plural = 'Asignaturas'
    types = (
        ('obligatoria', 'Obligatoria'),
        ('opcion', 'Opcion'),
    )
            
    subject_id = models.AutoField(verbose_name='Id', primary_key=True)
    name = models.CharField(verbose_name='Nombre', blank=False, null=False, unique=True, max_length=60)
    subject_type = models.CharField(max_length=15, choices=types, default='opcion')
    
    category_id = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null= True,
        blank=True,
        verbose_name='Id categoria'
    )
    
    phase_id = models.ForeignKey(
        Phase,
        related_name='subjects',
        on_delete=models.PROTECT,
        verbose_name='Id fase'
    )
    
    modality_id = models.ManyToManyField(
        Modality,
        through='SubjectModality',
        related_name='subjects',

    )
    
    def __str__(self):
        return self.name
    

class SubjectModality(models.Model):
    class Meta:
        verbose_name = 'Modalidad Asigntura'
        verbose_name_plural = 'Modalidades Asignatura'
        unique_together = ('subject_id', 'modality_id',)
    
    subject_id = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        verbose_name='Asignatura'
    )
    
    modality_id = models.ForeignKey(
        Modality,
        on_delete=models.CASCADE,
        verbose_name='Modality'
    )