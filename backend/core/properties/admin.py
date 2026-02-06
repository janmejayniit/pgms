from django.contrib import admin

# Register your models here.
from .models import PropertiesDetails, RoomDetails, Complaint, RatingReview

@admin.register(PropertiesDetails)
class PropertiesAdmin(admin.ModelAdmin):
    list_display = ('id', 'pg_name', 'user', 'total_rooms', 'created_at')
    search_fields = ('pg_name', 'address')
    list_filter = ('created_at',)

@admin.register(RoomDetails)
class RoomAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'room_number',
        'pg',
        'floor',
        'capacity',
        'current_occupancy',
        'is_available',
    )
    search_fields = ('room_number',)
    list_filter = ('is_available', 'floor')

@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = ('id', 'subject', 'tenant', 'pg', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('subject', 'description')

@admin.register(RatingReview)
class RatingReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'rating', 'tenant', 'pg', 'created_at')
    list_filter = ('rating',)
