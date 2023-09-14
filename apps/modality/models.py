from django.db import models

# Create your models here.
# 
"""
  id_modalidad integer [primary key]
  nombre varchar(30) [unique]
"""

class Modality(models.Model):
    class Meta:
        verbose_name = 'Modalidad'
        verbose_name_plural = 'Modalidades'
        
    modality_id = models.AutoField(primary_key=True, verbose_name='Id modalidad')
    name = models.CharField(verbose_name='Nombre', unique=True, null=False, blank=False, max_length=60)
    
    
    def __str__(self):
        return self.name