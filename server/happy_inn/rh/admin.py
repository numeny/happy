# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from rh.models import rh
from rh.models import city
from rh.models import favorite
from rh.models import RhUser



# Register your models here.
class rhAdmin(admin.ModelAdmin):
    list_display = ('id','rh_name', 'rh_type')
    search_fields = ('id', )

class cityAdmin(admin.ModelAdmin):
    list_display = ('privince', 'city', 'area')
    search_fields = ('city', )

class favoriteAdmin(admin.ModelAdmin):
    list_display = ('uid', 'rhId')
    search_fields = ('uid', )

class RhUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'password', 'user_type', 'unionid', 'openid')
    search_fields = ('username', )


# Register your models here.
admin.site.register(rh, rhAdmin)
admin.site.register(favorite, favoriteAdmin)
admin.site.register(RhUser, RhUserAdmin)
admin.site.register(city, cityAdmin)
