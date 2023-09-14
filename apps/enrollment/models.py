from django.db import models
from apps.announcement.models import Announcement
from apps.student.models import Student
from apps.subject.models import Subject
from apps.degree.models import Degree
from apps.exam.models import Classroom

# Create your models here.

"""
table matriculas {
  codigo integer [primary key]
  fecha datetime
  id_convocatoria integer [not null]
  id_alumno integer [not null]
  precio decimal [not null]
  copia_documento text
  justificante_pago text
  
  // unique key(id_alumno, id_convocatoria)
  
}

"""
def enrollment_docs_directory(instance, filename):
    return f'enrollments/{instance.announcement}/{instance.code}/{filename}'


class Enrollment(models.Model):
    enrollment_status = (
        (0, 'No Formalizada'),
        (1, 'Formalizada'),
        (2, 'Validada'), 
        (3, 'Valida Parcialmente')
    )
    document_status = (
        (0, 'Sin validar'),
        (1, 'Valido'),
        (2, 'No valido') 
    )
        
    class Meta:
        verbose_name = 'Matrícula'
        verbose_name_plural = 'Matrículas'
        unique_together = ('student', 'announcement',)
    
    code = models.CharField(verbose_name='Codigo', primary_key=True, max_length=255)
    enrollment_date = models.DateTimeField(verbose_name='Fecha Matricula', blank=False, null=False)
    announcement = models.ForeignKey(
        Announcement,
        on_delete=models.RESTRICT,
        null=False,
        verbose_name='Convocatoria'
    )
    
    student = models.ForeignKey(
        Student,
        on_delete= models.RESTRICT,
        null=False,
        blank=False,
        verbose_name='Alumno'
    )
    price = models.PositiveIntegerField(verbose_name = 'Precio')
    copy_id_card = models.FileField(verbose_name='Copia documento identidad', max_length=500, upload_to=enrollment_docs_directory)
    proof_of_payment = models.FileField(verbose_name='Justificante pago', max_length=500, upload_to=enrollment_docs_directory)
    status = models.SmallIntegerField(verbose_name="Estado", choices=enrollment_status, default=0)
    status_id_card = models.SmallIntegerField(verbose_name="DNI Valido", choices=document_status, default=0)
    status_proof_payment = models.SmallIntegerField(verbose_name="Justificante Pago Valido", choices=document_status, default=0)
    # enrollment subjets many 2 many relationship
    subjects = models.ManyToManyField(
        Subject,
        through='EnrollmentSubjects',
    )
    
    exam_class_room = models.ForeignKey(
        Classroom,
        on_delete=models.SET_NULL,
        null=True,
        verbose_name='Sala examen'
    )
    
    # enrollment degrees and carrrers choosen
    degrees = models.ManyToManyField(
        Degree,
        through='ChosenDegrees',
    )
    
    def __str__(self):
        return self.code





"""
table asignaturas_matricula {
  codigo_matricula integer [primary key,not null]
  codigo_asignatura integer [primary key, not null]
}

"""

class EnrollmentSubjects(models.Model):
    class Meta:
        verbose_name = 'Asignatura Matricula'
        verbose_name_plural = 'Asignaturas Matricula'
        unique_together = ('enrollment', 'subject',)
    
    enrollment = models.ForeignKey(
        Enrollment, 
        on_delete=models.CASCADE,
        verbose_name='Matricula'
    )
    
    subject = models.ForeignKey(
        Subject, 
        on_delete=models.CASCADE,
        verbose_name='Asignatura'
    )

    def __str__(self):
        return f'{self.enrollment} - {self.subject}'


class ChosenDegrees(models.Model):
    class Meta:
        verbose_name = 'Carrera elegida'
        verbose_name_plural = 'Carreras elegidas'
        unique_together = ('enrollment', 'degree',)
    
    
    enrollment = models.ForeignKey(
        Enrollment, 
        on_delete=models.CASCADE,
        verbose_name='Matricula'
    )
    
    degree = models.ForeignKey(
        Degree, 
        on_delete=models.CASCADE,
        verbose_name='Carrera'
    )   
    
        
    def __str__(self):
        return f'{self.enrollment} - {self.degree}'
    