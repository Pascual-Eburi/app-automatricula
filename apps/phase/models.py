from django.db import models

# Phases
"""
  id_fase integer [primary key]
  nombre varchar(15) [unique]
"""
class Phase(models.Model):
    class Meta:
        verbose_name = 'Fase'
        verbose_name_plural = 'Fases'
        
    phase_id = models.AutoField(verbose_name='Id', primary_key=True)
    name = models.CharField(verbose_name='nombre', max_length=30, unique=True, blank=False)
    
    def __str__(self):
        return self.name