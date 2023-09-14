from django.contrib import admin
from .models import Province, District

# model Province admin
class ProvinceAdmin(admin.ModelAdmin):
    list_display = ('province_id', 'name',)
    list_display_links = ('province_id',)
    list_editable = ('name',)
    search_fields = ('name', )
    list_per_page = 25
    
# Register model and the model admin to djando admin site
admin.site.register(Province, ProvinceAdmin)


# model District admin
class DistrictAdmin(admin.ModelAdmin):
    list_display = ('district_id', 'name',)
    list_display_links = ('district_id',)
    list_editable = ('name',)
    search_fields = ('name', )
    list_per_page = 25
    
# Register model and the model admin to djando admin site
admin.site.register(District, DistrictAdmin)
