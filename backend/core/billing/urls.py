# urls.py
from django.urls import path
from .views import verify_payment,create_booking_order, payment_failed, refund_payment, invoice_data

urlpatterns = [
    path('create-booking-order/', create_booking_order, name='create-booking-order'),
    path('verify-payment/', verify_payment, name='verify-payment'),
    path('payment-failed/', payment_failed, name='payment-failed'),
    path('refund-payment/', refund_payment, name='refund-payment'),
    path('invoice/<int:booking_id>/',invoice_data, name='invoice')
]
