from django.shortcuts import render

# Create your views here.
from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import RegisterSerializer
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer, OTPVerifySerializer, ResetPasswordSerializer
from .models import PasswordResetOTP
from .utils import send_sms_otp
import random
from django.core.mail import send_mail
from rest_framework.views import APIView
from .serializers import ForgotPasswordSerializer
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

class RegisterAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"message": "User registered successfully"},
            status=status.HTTP_201_CREATED
        )

class LoginAPIView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class ForgotPasswordAPIView(APIView):
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"error": "User not found"}, status=404)
        '''stop frequently send otp'''
        recent_otps = PasswordResetOTP.objects.filter(user=user, created_at__gte=timezone.now() - timedelta(minutes=10)).count()
        if recent_otps >= 3:
            return Response({"error": "OTP limit exceeded. Try again later."},status=429)
        otp = str(random.randint(100000, 999999))
        PasswordResetOTP.objects.create(user=user, otp=otp)
        # send otp on email
        send_mail(
            subject="Password Reset OTP",
            message=f"Your OTP is {otp}",
            from_email="noreply@example.com",
            recipient_list=[email],
        )
        # send otp as sms
        send_sms_otp(user.contact_number, otp)
        print(otp)
        return Response({"message": "OTP sent successfully"})

class VerifyOTPAPIView(APIView):
    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']
        if otp_obj.is_expired():
            return Response({"error": "OTP expired"}, status=400)
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"error": "User not found"}, status=404)
        otp_obj = PasswordResetOTP.objects.filter(
            user=user, otp=otp, is_verified=False
        ).last()
        if not otp_obj:
            return Response({"error": "Invalid OTP"}, status=400)
        otp_obj.is_verified = True
        otp_obj.save()
        return Response({"message": "OTP verified successfully"})


class ResetPasswordAPIView(APIView):
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        new_password = serializer.validated_data['new_password']
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"error": "User not found"}, status=404)
        otp_verified = PasswordResetOTP.objects.filter(
            user=user, is_verified=True
        ).exists()
        if not otp_verified:
            return Response({"error": "OTP not verified"}, status=400)
        user.set_password(new_password)
        user.save()
        PasswordResetOTP.objects.filter(user=user).delete()
        return Response({"message": "Password reset successful"})
