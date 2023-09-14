from django.contrib import admin
from .models import Institute, ExamCenterAssignment

class ExamCenterAssigmentInline(admin.TabularInline):
    model = ExamCenterAssignment
    extra = 1
    autocomplete_fields = [ 'institute_id','announcement_id',]


# model Institute admin
class InstituteAdmin(admin.ModelAdmin):
    inlines = [ExamCenterAssigmentInline, ]
    list_display = ('code', 'name','address', )
    list_display_links = ('code',)
    list_editable = ('name',)
    search_fields = ('name', )
    list_per_page = 25
    
# Register model and the model admin to djando admin site
admin.site.register(Institute, InstituteAdmin)



# model exam place asignation admin
class ExamCenterAssigmentAdmin(admin.ModelAdmin):
    list_display = ('assign_id', 'seats', 'classroom_id', 'institute_id','announcement_id',)
    list_display_links = ('assign_id',)
    list_editable = ('seats','classroom_id', 'institute_id','announcement_id',)
    search_fields = ('seats','classroom_id', 'institute_id','announcement_id',)
    list_per_page = 25
    
#admin.site.register(ExamCenterAssignment,ExamCenterAssigmentAdmin)
    
