from django.contrib import admin
from .models import Grade




# Register your models here.
class GradeAdmin(admin.ModelAdmin):
    list_display = ('grade_id', 'exam_id', 'enrollment', 'grade')


admin.site.register(Grade, GradeAdmin)