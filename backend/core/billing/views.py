from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions
from .serializers import InvoiceSerializer
from .models import Invoice
from rest_framework import generics, permissions
from .models import PaymentDetails, Notification
from .serializers import PaymentDetailsSerializer, NotificationSerializer


class InvoiceListAPIView(generics.ListAPIView):
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.is_tenant:
            return Invoice.objects.filter(tenant=user)

        if user.is_owner:
            return Invoice.objects.filter(owner=user)

        return Invoice.objects.none()

class PaymentListAPIView(generics.ListAPIView):
    serializer_class = PaymentDetailsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.is_tenant:
            return PaymentDetails.objects.filter(tenant=user)

        if user.is_owner:
            return PaymentDetails.objects.filter(pg__user=user)

        return PaymentDetails.objects.none()

class NotificationListAPIView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by("-created_at")


from rest_framework.views import APIView
from rest_framework.response import Response

class NotificationReadAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        Notification.objects.filter(id=pk, user=request.user).update(is_read=1)
        return Response({"message": "Notification marked as read"})
