from django.contrib import admin
from .models import Enrollment, ChosenDegrees, EnrollmentSubjects
   
# Register your models here.

class EnrollmentSubjectsInline(admin.TabularInline):
    model = EnrollmentSubjects
    extra = 1
    #autocomplete_fields = ['']

 
class ChoosenDegreesInline(admin.TabularInline):
    model = ChosenDegrees
    extra = 3

class EnrollmentAdmin(admin.ModelAdmin):
    inlines = [EnrollmentSubjectsInline, ChoosenDegreesInline,]
    list_display = ('code','announcement', 'enrollment_date', 'student', 'price', 'copy_id_card', 'proof_of_payment',)
    
    
admin.site.register(Enrollment, EnrollmentAdmin)