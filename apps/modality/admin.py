from django.contrib import admin
from .models import Modality


# model Modality admin
class ModalityAdmin(admin.ModelAdmin):
    list_display = ('modality_id', 'name', )
    list_display_links = ['modality_id']
    list_editable = ['name']
    search_fields = ['name']
    list_per_page = 10
    
    
    
admin.site.register(Modality, ModalityAdmin)
