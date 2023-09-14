from django.contrib import admin
from .models import Degree,ModalityDegrees

class ModalityDegreesInline(admin.TabularInline):
    model = ModalityDegrees
    extra = 1

# model Degree admin
class DegreeAdmin(admin.ModelAdmin):
    inlines = [ModalityDegreesInline, ]
    
    list_display = ('degree_id', 'name', )
    list_display_links = ['degree_id']
    list_editable = ['name']
    search_fields = ['name']
    list_per_page = 20
     
admin.site.register(Degree, DegreeAdmin)
