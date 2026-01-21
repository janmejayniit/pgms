from datetime import timedelta
from celery import shared_task
from django.utils import timezone
from .models import Booking

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def send_live_notification(user, title, message):
    channel_layer = get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        f"user_{user.id}",
        {
            "type": "send_notification",
            "data": {
                "title": title,
                "message": message,
            },
        },
    )

@shared_task
def checkout_reminder():
    tomorrow = timezone.now().date() + timedelta(days=1)

    bookings = Booking.objects.filter(
        checkout_date=tomorrow,
        status="confirmed"
    )

    for booking in bookings:
        send_live_notification(
            booking.tenant,
            "Checkout Reminder",
            "Your checkout is scheduled for tomorrow."
        )


@shared_task(bind=True, max_retries=3)
def auto_checkout_and_notify(self):
    today = timezone.now().date()

    bookings = Booking.objects.filter(
        checkout_date__lt=today,
        status__in=['confirmed', 'completed']
    )

    for booking in bookings:
        if booking.status != 'completed':
            booking.status = 'completed'
            booking.room.is_available = True
            booking.room.save()
            booking.save()

        if not booking.notified:
            # notify_tenant(booking)
            # notify_admin(booking)
            booking.notified = True
            booking.save()
