from django.urls import path
from .views import (
    OrderCreateAPIView,
    BookingCreateAPIView,
    BookingListAPIView,
    BookingDetailAPIView,
    BookingCancelAPIView,
    razorpay_webhook,
    VerifyPaymentAPIView
)

urlpatterns = [
    path("", BookingListAPIView.as_view()),
    path("order/create/", OrderCreateAPIView.as_view()),
    path("create/", BookingCreateAPIView.as_view()),
    path("<int:pk>/", BookingDetailAPIView.as_view()),
    path("<int:pk>/cancel/", BookingCancelAPIView.as_view()),
    path("razorpay/webhook/", razorpay_webhook),
    path("verify-payment/", VerifyPaymentAPIView.as_view()),
]
