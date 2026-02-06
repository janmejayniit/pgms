from django.db import models

# Create your models here.
class Order(models.Model):
    id = models.BigAutoField(primary_key=True)
    razorpay_order_id = models.CharField(unique=True, max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10)
    status = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    pg = models.ForeignKey('properties.PropertiesDetails', on_delete=models.CASCADE)
    room = models.ForeignKey('properties.RoomDetails', on_delete=models.CASCADE)
    tenant = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    refund_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    refund_status = models.CharField(max_length=20, null=True, blank=True)
    razorpay_payment_id = models.CharField(max_length=100, null=True, blank=True)
    razorpay_signature = models.CharField(max_length=255, null=True, blank=True)



class Booking(models.Model):
    id = models.BigAutoField(primary_key=True)
    booking_type = models.CharField(max_length=10)
    checkin_date = models.DateField()
    checkout_date = models.DateField(blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    pg = models.ForeignKey('properties.PropertiesDetails', on_delete=models.CASCADE)
    room = models.ForeignKey('properties.RoomDetails', on_delete=models.CASCADE)
    tenant = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    notified = models.BooleanField(default=False)

# class Booking(models.Model):
#     id = models.BigAutoField(primary_key=True)
#     booking_type = models.CharField(max_length=10)
#     checkin_date = models.DateField()
#     checkout_date = models.DateField(blank=True, null=True)
#     amount = models.DecimalField(max_digits=10, decimal_places=2)
#     status = models.CharField(max_length=20)
#     created_at = models.DateTimeField()
#     pg = models.ForeignKey('properties.PropertiesDetails', on_delete=models.CASCADE)
#     room = models.ForeignKey('properties.RoomDetails', on_delete=models.CASCADE)
#     tenant = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
#     order = models.ForeignKey(Order, on_delete=models.CASCADE)
#     notified = models.BooleanField(default=False)