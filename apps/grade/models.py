from django.db import models
from apps.enrollment.models import Enrollment
from apps.exam.models import Exam

# Create your models here.


"""
table notas {
  id_nota integer [primary key]
  id_matricula integer
  id_examen integer
  nota decimal
  //estado char(1)
}


"""

class Grade(models.Model):
    class Meta:
        verbose_name = 'Nota'
        verbose_name_plural = 'Notas'
        unique_together = ('enrollment', 'exam_id',)
        
        
    grade_id = models.BigAutoField(verbose_name='ID', primary_key=True)
    
    enrollment = models.ForeignKey(
        Enrollment,
        on_delete=models.CASCADE,
        verbose_name='Matricula'
    )
    exam_id = models.ForeignKey(
        Exam,
        on_delete=models.CASCADE,
        verbose_name='Exam'
    )
    
    grade = models.FloatField(verbose_name='Nota', max_length=4)
    
    
    def __str__(self):
        return f'{self.enrollment} - {self.exam_id.subject_id.name}'