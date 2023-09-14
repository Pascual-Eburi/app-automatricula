from django.db import models
from apps.geodata.models import District
from apps.announcement.models import Announcement
from apps.exam.models import Classroom
from django.core.exceptions import ValidationError


# Create your models here.
"""
  codigo integer [primary key]
  nombre varchar(50) [unique]
  direccion varchar(100)
  id_distrito integer [not null]
"""

class Institute(models.Model):
    class Meta:
        verbose_name = 'Instituto'
        verbose_name_plural = 'Institutos'
        
    code = models.AutoField(verbose_name='Código',primary_key=True)
    name = models.CharField(verbose_name='Nombre',max_length=50, unique=True, null= False, blank=False)
    address = models.CharField(verbose_name='Direccion',max_length=150)
    district_id = models.ForeignKey(
        District, 
        on_delete=models.SET_NULL,
        null=True
    )

    def __str__(self):
        return self.name

"""
    table asignacion_instituto_centro_examen{
        id_asinacion integer [primary key]
        id_sala integer [unique]
        id_instituto integer [unique]
        plazas integer
        id_convocatoria
    }

"""
class ExamCenterAssignment(models.Model):
    class Meta:
        verbose_name = 'Asignación centro de examen'
        verbose_name_plural = 'Asignaciones centros de examen'
    
    
    def clean(self):
        # Obtain the total number of places assigned to the room for other centers in the same call for applications.
        total_assigned_seats = ExamCenterAssignment.objects.filter(
            classroom_id=self.classroom_id,
            announcement_id=self.announcement_id
        ).exclude(assign_id=self.assign_id).aggregate(total_seats=models.Sum('seats'))['total_seats'] or 0

        # Calculate the available capacity of the room
        available_capacity = self.classroom_id.capacity - total_assigned_seats

        # Validate that the number of seats assigned is not greater than the available capacity of the room.
        if self.seats > available_capacity:
            raise ValidationError(f"Solo hay {self.get_available_seats()} plaza/s disponibles para esta convocatoria")

    
    
    assign_id = models.BigAutoField(verbose_name='Id asignacion', primary_key=True)
    seats = models.PositiveSmallIntegerField(verbose_name='Nº Plazas', default=0)
    classroom_id = models.ForeignKey(
        Classroom,
        on_delete=models.CASCADE,
        verbose_name='Id sala'
    )
    institute_id = models.ForeignKey(
        Institute,
        related_name='exam_centers',
        on_delete=models.CASCADE,
        verbose_name='Id instituto'
    )
    announcement_id = models.ForeignKey(
        Announcement,
        on_delete=models.CASCADE,
        verbose_name='Id convocatoria'
    )
    
    
    """     def __str__(self):
        return f'{self.classroom_id.name} - {self.classroom_id.center_id.name}' """
    
    def get_asigned_seats(self):
        total_assigned_seats = ExamCenterAssignment.objects.filter(
            classroom_id=self.classroom_id,
            announcement_id=self.announcement_id
        ).aggregate(total_seats=models.Sum('seats'))['total_seats'] or 0
        
        return total_assigned_seats
    
    def get_available_seats(self):
        return self.classroom_id.capacity - self.get_asigned_seats()
        
    
    def __str__(self):
        # Seats
        available_capacity = self.get_available_seats()
        return f'{self.classroom_id.name} - {self.classroom_id.center_id.name} ({available_capacity} Plazas disponibles)'
