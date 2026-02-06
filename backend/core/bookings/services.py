import uuid
from billing.models import Invoice, Refund
import razorpay
from django.conf import settings

def create_invoice(booking):
    Invoice.objects.create(
        invoice_number=str(uuid.uuid4()).split("-")[0],
        booking=booking,
        tenant=booking.tenant,
        owner=booking.pg.user,
        subtotal=booking.amount,
        tax=0,
        total=booking.amount,
        status="paid"
    )

def create_refund(invoice, amount, reason):
    Refund.objects.create(
        invoice=invoice,
        amount=amount,
        reason=reason,
        status="initiated"
    )


client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)

def create_razorpay_order(amount):
    return client.order.create({
        "amount": int(amount * 100),  # paise
        "currency": "INR",
        "payment_capture": 1
    })
