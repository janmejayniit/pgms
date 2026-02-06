from django.contrib import admin

# Register your models here.
from .models import PaymentDetails, Notification


@admin.register(PaymentDetails)
class PaymentDetailsAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'transaction_id',
        'amount_paid',
        'payment_method',
        'tenant',
        'pg',
        'payment_date',
    )
    search_fields = ('transaction_id',)
    list_filter = ('payment_method', 'payment_date')

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'user', 'is_read', 'created_at')
    list_filter = ('is_read',)
    search_fields = ('title', 'message')
