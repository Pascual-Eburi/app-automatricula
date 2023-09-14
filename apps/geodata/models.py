from django.db import models

# Create your models here.
class Province(models.Model):
    class Meta:
        verbose_name = 'Province'
        verbose_name_plural = 'Pronvince'
        
    province_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, unique=True, null=False)

    def __str__(self):
        return self.name
    
class District(models.Model):
    
    class Meta:
        verbose_name = 'District'
        verbose_name_plural = 'Districts'
        
    district_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, unique=True)
    province_id = models.ForeignKey(
        Province,
        related_name='districts',
        on_delete=models.CASCADE
    )

    def __str__(self):
        return self.name