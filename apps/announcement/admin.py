from django.contrib import admin
from .models import Announcement

# model Announcement admin
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ('announcement_id', 'name', 'list_submision_start', 'list_submision_end', 'enrollment_start', 'enrollment_end', 'grades_publication', )
    list_display_links = ['announcement_id']
    list_editable = ['name', 'name', 'list_submision_start', 'list_submision_end', 'enrollment_start', 'enrollment_end', 'grades_publication', ]
    search_fields = ['name']
    list_per_page = 25
    

# Register to djando admin panel
admin.site.register(Announcement, AnnouncementAdmin)
