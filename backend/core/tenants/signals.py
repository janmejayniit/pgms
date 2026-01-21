from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import TenantDetail
from  properties.models import  RoomDetails

# Optional: Twilio setup
# from twilio.rest import Client

@receiver(post_save, sender=TenantDetail)
def tenant_notification(sender, instance, created, **kwargs):
    """Send email + SMS when a tenant is created or rejoins"""
    
    subject = ''
    message = ''
    sms_message = ''

    if created:
        # New tenant created
        subject = f"New Tenant Added - {instance.user.first_name} {instance.user.last_name}"
        message = (
            f"Hello {instance.user.first_name},\n\n"
            f"You have been successfully registered in PG '{instance.pg.pg_name}'.\n"
            f"Room Number: {instance.room.room_number}\n"
            # f"Rent: {instance.room.rent} ({instance.rent_type})\n\n"
            f"Welcome aboard!\n"
        )
        sms_message = f"Welcome {instance.user.first_name}! You have joined {instance.pg.pg_name}."

    elif instance.status == 'active' and instance.vacated_date is None:
        # Rejoined tenant
        subject = f"Tenant Rejoined - {instance.user.first_name}"
        message = (
            f"Hello {instance.user.first_name} {instance.user.last_name},\n\n"
            f"You have successfully rejoined PG '{instance.pg.pg_name}'.\n"
            f"New Room: {instance.room.room_number}\n"
            # f"Rent: {instance.room.rent} ({instance.rent_type})\n\n"
            f"Welcome back!\n"
        )
        sms_message = f"Hi {instance.first_name}, welcome back to {instance.pg.pg_name}!"

    else:
        # Skip if not a relevant event
        return

    # Send Email
    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [instance.user.email],
            fail_silently=False,
        )
    except Exception as e:
        print("Email send failed:", e)

    # Send SMS (example using Twilio)
    # try:
    #     if hasattr(settings, "TWILIO_ACCOUNT_SID"):
    #         client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    #         client.messages.create(
    #             body=sms_message,
    #             from_=settings.TWILIO_PHONE_NUMBER,
    #             to=f"+91{instance.personalContact}"  # Adjust for your country code
    #         )
    #     else:
    #         print(f"SMS (test): {sms_message} -> {instance.personalContact}")
    # except Exception as e:
    #     print("SMS send failed:", e)


# @receiver(post_save, sender=TenantDetail)
# def update_room_on_tenant_save(sender, instance, created, **kwargs):
#     """Update room occupancy when tenant is added or updated."""
#     room = instance.room
#     if room:
#         # Count how many active tenants are assigned to this room
#         active_tenants = room.tenants.filter(status='active').count()
#         room.current_occupancy = active_tenants
#         room.status = 'occupied' if active_tenants >= room.capacity else 'available'
#         room.save(update_fields=['current_occupancy', 'status'])


# @receiver(post_delete, sender=TenantDetail)
# def update_room_on_tenant_delete(sender, instance, **kwargs):
#     """Update room occupancy when tenant is removed or vacated."""
#     room = instance.room
#     if room:
#         active_tenants = room.tenants.filter(status='active').count()
#         room.current_occupancy = active_tenants
#         room.status = 'occupied' if active_tenants >= room.capacity else 'available'
#         room.save(update_fields=['current_occupancy', 'status'])
