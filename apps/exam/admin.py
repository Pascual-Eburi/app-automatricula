from django.contrib import admin
from .models import Exam, Classroom, ExamCenter

# model Examen admin
class ExamAdmin(admin.ModelAdmin):
    list_display = ('exam_id', 'subject_id', 'announcement_id', 'exam_date','start_time', 'end_time',)
    list_display_links = ['exam_id']
    list_editable = ['subject_id', 'announcement_id', 'exam_date','start_time', 'end_time']
    search_fields = ['subject_id', 'announcement_id']
    list_per_page = 10
     
admin.site.register(Exam, ExamAdmin)


class ClassroomInline(admin.TabularInline):
    model = Classroom
    extra = 2
    autocomplete_fields = ['center_id']


class ExamCenterAdmin(admin.ModelAdmin):
    inlines = [ClassroomInline, ]
    list_display = ('center_id','name', 'district_id', 'address',)
    list_display_links = ['center_id']
    list_editable = ['name', 'district_id', 'address']
    search_fields = ['name']
    list_per_page = 10
    
admin.site.register(ExamCenter, ExamCenterAdmin)

    
class ClassroomAdmin(admin.ModelAdmin):
    list_display = ('classroom_id','name', 'capacity', 'center_id',)
    list_display_links = ['classroom_id']
    list_editable = ['name', 'capacity', 'center_id']
    search_fields = ['name', 'center_id']
    list_per_page = 15
    

#admin.site.register(Classroom, ClassroomAdmin)
