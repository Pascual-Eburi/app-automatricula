from django.contrib import admin
from .models import Category, Subject, SubjectModality


class SubjectModalityInline(admin.TabularInline):
    model = SubjectModality
    extra = 1

# model category admin
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('category_id', 'name', )
    list_display_links = ['category_id']
    list_editable = ['name']
    search_fields = ['name']
    list_per_page = 10
    
    
    
admin.site.register(Category, CategoryAdmin)

# model category admin
class SubjectAdmin(admin.ModelAdmin):
    inlines = [SubjectModalityInline, ]
    list_display = ('subject_id', 'name', 'category_id', 'phase_id', )
    list_display_links = ['subject_id']
    list_editable = ['name', 'category_id', 'phase_id', ]
    search_fields = ['name']
    list_per_page = 10


admin.site.register(Subject, SubjectAdmin)