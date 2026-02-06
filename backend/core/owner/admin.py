from django.contrib import admin

# Register your models here.
from .models import OwnerDetail


@admin.register(OwnerDetail)
class OwnerDetailAdmin(admin.ModelAdmin):
    list_display = ('total_properties',
'photo',
'proof_id_name',
'photo_id_proof',
'country',
'state',
'city',
'address',
'is_verified')
    # list_filter = ('status', 'booking_type')