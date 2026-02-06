from celery import shared_task
from django.utils import timezone
from .models import Booking, Invoice
from utils.notifications import send_email, send_sms


@shared_task
def auto_checkout_bookings():
    today = timezone.now().date()

    bookings = Booking.objects.filter(
        checkout_date__lt=today,
        status="confirmed"
    )

    for booking in bookings:
        booking.status = "completed"
        booking.save()

        # Reduce room occupancy
        room = booking.room
        room.current_occupancy -= 1
        room.save()

        Invoice.objects.filter(
            booking=booking
        ).update(status="paid")

        # Notify tenant
        send_email(
            "Checkout Completed",
            "Your stay has ended. Thank you!",
            booking.tenant.email
        )

        send_sms(
            booking.tenant.contact_number,
            "Your checkout is completed. Thank you!"
        )




