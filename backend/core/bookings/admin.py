from django.contrib import admin

# Register your models here
from .models import Order, Booking

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'razorpay_order_id',
        'amount',
        'currency',
        'status',
        'tenant',
        'created_at',
    )
    search_fields = ('razorpay_order_id',)
    list_filter = ('status', 'currency')

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'booking_type',
        'pg',
        'room',
        'tenant',
        'status',
        'checkin_date',
        'checkout_date',
    )
    list_filter = ('status', 'booking_type')
