from django.db import models

# Models definicions

"""
  id_convocatoria integer [primary key]
  nombre varchar(20) [unique]
  inicio_presentacion_listas datetime
  fin_presentacion_listas datetime
  inicio_matricula datetime
  fin_matricula datetime
"""

# Announcement
class Announcement(models.Model):
    class Meta:
        verbose_name = 'Convocatoria'
        verbose_name_plural = 'Convocatorias'
        
    
    announcement_id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=20, unique=True, blank=False, null=False)
    list_submision_start = models.DateTimeField(null=False, blank=False)
    list_submision_end = models.DateTimeField(null=False, blank=False)
    
    enrollment_start = models.DateTimeField(null=False, blank=False)
    enrollment_end = models.DateTimeField(null=False, blank=False)
    
    grades_publication = models.DateTimeField(null=False, blank=False)
    
    
    def __str__(self):
        
        return self.name

    