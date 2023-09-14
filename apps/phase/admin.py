from django.contrib import admin
from .models import Phase


# model Phase admin
class PhaseAdmin(admin.ModelAdmin):
    list_display = ('phase_id', 'name', )
    list_display_links = ['phase_id']
    list_editable = ['name']
    search_fields = ['name']
    list_per_page = 10
    
    
    
admin.site.register(Phase, PhaseAdmin)
