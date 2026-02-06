from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.utils import timezone
from .models import Order, Booking
from .serializers import OrderSerializer, BookingSerializer
from .permissions import IsTenant, IsOwnerOrTenant
from .utils.notifications import send_email, send_sms
from .services import create_invoice
from .services import create_refund
from .services import create_razorpay_order, client
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from razorpay.errors import SignatureVerificationError

import json
import hmac
import hashlib
from django.conf import settings
from django.http import HttpResponse

from billing.models import PaymentDetails, Notification

class OrderCreateAPIView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated,IsTenant]

    def perform_create(self, serializer):
        razorpay_order = create_razorpay_order(
            serializer.validated_data["amount"]
        )

        serializer.save(
            tenant=self.request.user,
            razorpay_order_id=razorpay_order["id"],
            currency="INR",
            status="created",
            created_at=timezone.now(),
        )

class BookingCreateAPIView(generics.CreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated, IsTenant]
    
    def perform_create(self, serializer):
         
        serializer.save(
            tenant=self.request.user,
            notified=False
        )

        return Response({"message": "Booking created"})
        
        # Notifications
        # send_email(
        #     "Booking Confirmed",
        #     f"Your booking for room {room.room_number} is confirmed.",
        #     booking.tenant.email
        # )
        # send_sms(
        #     booking.tenant.contact_number,
        #     "Your booking is confirmed. Welcome!"
        # )

class BookingListAPIView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.is_tenant:
            return Booking.objects.filter(tenant=user)

        if user.is_owner:
            return Booking.objects.filter(pg__user=user)

        return Booking.objects.none()

class BookingDetailAPIView(generics.RetrieveAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrTenant]

class BookingCancelAPIView(generics.UpdateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated, IsTenant]

    def update(self, request, *args, **kwargs):
        booking = self.get_object()
        if booking.status != "confirmed":
            return Response({"error": "Cannot cancel"}, status=400)
        
        from utils.refund import calculate_refund
        refund_amount = calculate_refund(booking)

        booking.status = "cancelled"
        booking.save()

        booking.order.refund_amount = refund_amount
        booking.order.refund_status = "initiated"
        booking.order.save()

        # Update room occupancy
        room = booking.room
        room.current_occupancy -= 1
        room.save()

        Notification.objects.create(
            title="Refund Initiated",
            message=f"Refund of ₹{refund_amount} has been initiated.",
            user=booking.tenant,
            is_read=0,
            created_at=timezone.now()
        )

        # create invoice
        create_refund(
            booking.invoice,
            refund_amount,
            "Booking cancelled"
        )
        
        return Response({"message": "Booking cancelled"})

@csrf_exempt
def razorpay_webhook(request):
    signature = request.headers.get("X-Razorpay-Signature")
    if not signature:
        return HttpResponse(status=400)

    payload = request.body

    expected_signature = hmac.new(
        bytes(settings.RAZORPAY_WEBHOOK_SECRET, "utf-8"),
        payload,
        hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(expected_signature, signature):
        return HttpResponse(status=400)

    data = json.loads(payload)

    if data["event"] == "payment.captured":
        payment = data["payload"]["payment"]["entity"]
        order_id = payment["order_id"]

        try:
            order = Order.objects.get(razorpay_order_id=order_id)
        except Order.DoesNotExist:
            return HttpResponse(status=200)

        # Idempotency guard
        if order.status == "paid":
            return HttpResponse(status=200)

        order.status = "paid"
        order.save()

    return HttpResponse(status=200)

class VerifyPaymentAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data

        # Verify signature
        client.utility.verify_payment_signature({
            "razorpay_order_id": data["razorpay_order_id"],
            "razorpay_payment_id": data["razorpay_payment_id"],
            "razorpay_signature": data["razorpay_signature"],
        })

        order = Order.objects.get(
            razorpay_order_id=data["razorpay_order_id"]
        )

        order.status = "paid"
        order.save()

        booking = Booking.objects.get(order=order)
        booking.status = "confirmed"
        booking.save()

        # Update room occupancy
        room = booking.room
        room.current_occupancy += 1
        room.save()

        # Payment details
        PaymentDetails.objects.create(
            amount_paid=booking.amount,
            payment_date=timezone.now(),
            payment_method="razorpay",
            transaction_id=data["razorpay_payment_id"],
            pg=booking.pg,
            room=booking.room,
            tenant=booking.tenant,
            order=order,
        )

        # Invoice
        create_invoice(booking)

        # send_email(
        #     "Booking Confirmed",
        #     f"Your booking for room {room.room_number} is confirmed.",
        #     booking.tenant.email
        # )
        # send_sms(
        #     booking.tenant.contact_number,
        #     "Your booking is confirmed. Welcome!"
        # )

        return Response(
            {"message": "Payment verified successfully"},
            status=status.HTTP_200_OK
        )

