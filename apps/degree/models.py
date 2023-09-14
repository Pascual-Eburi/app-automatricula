from django.db import models
from apps.modality.models import Modality

# Create your models here.
"""
Table carreras {
  id_carrera integer [primary key]
  nombre varchar(80) [unique]
}
"""

class Degree(models.Model):
    class Meta:
        verbose_name = 'Carrera'
        verbose_name_plural = 'Carreras'
        
    degree_id = models.AutoField(verbose_name='Id', primary_key=True)
    name = models.CharField(verbose_name='nombre', max_length=100, unique=True, blank=False, null=False)
    
    modality = models.ManyToManyField(
      Modality,
      through='ModalityDegrees',
      verbose_name='Modalidades'
    )
    
    
    def __str__(self):
        return self.name
      
      

class ModalityDegrees(models.Model):
  class Meta:
    verbose_name = 'Modalidad Carrera'
    verbose_name_plural = 'Modalidades Carrera'
    unique_together = ('degree_id', 'modality_id',)
    
  degree_id = models.ForeignKey(
    Degree,
    on_delete=models.CASCADE,
    verbose_name='Carrera'
  )
  
  modality_id = models.ForeignKey(
    Modality,
    on_delete=models.CASCADE,
    verbose_name='Modalidad'
  )
  
  
  def __str__(self):
    return f'{self.degree_id.name} - {self.modality_id.name}'