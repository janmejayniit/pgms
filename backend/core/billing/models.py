from django.db import models

class PaymentDetails(models.Model):
    id = models.BigAutoField(primary_key=True)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)
    payment_method = models.CharField(max_length=50)
    transaction_id = models.CharField(unique=True, max_length=100)
    remarks = models.TextField(blank=True, null=True)
    pg = models.ForeignKey('properties.PropertiesDetails', on_delete=models.CASCADE)
    room = models.ForeignKey('properties.RoomDetails',  on_delete=models.CASCADE)
    tenant = models.ForeignKey('accounts.User',  on_delete=models.CASCADE)
    order = models.ForeignKey('bookings.Order',  on_delete=models.CASCADE)


class Notification(models.Model):
    id = models.BigAutoField(primary_key=True)
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE)


class Invoice(models.Model):
    id = models.BigAutoField(primary_key=True)
    invoice_number = models.CharField(max_length=50, unique=True)
    booking = models.OneToOneField(
        'bookings.Booking',
        on_delete=models.CASCADE,
        related_name='invoice'
    )
    tenant = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    owner = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='owner_invoices')
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20)  # pending / paid / refunded
    created_at = models.DateTimeField(auto_now_add=True)


class Refund(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    reason = models.CharField(max_length=255)
    status = models.CharField(max_length=20)  # initiated / processed
    created_at = models.DateTimeField(auto_now_add=True)
