import razorpay
from django.conf import settings

client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)

def initiate_refund(payment_id, amount):
    return client.payment.refund(
        payment_id,
        {
            "amount": int(amount * 100)
        }
    )
