from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
# from .views import RegisterView,LoginView,send_otp, verify_otp, reset_password

# urlpatterns = [
#     path('register/', RegisterView.as_view(), name='register'),
#     # path('login/', TokenObtainPairView.as_view(), name='login'),
#     path('login/', LoginView.as_view(), name='login'),
#     path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
#     path("send-otp/", send_otp),
#     path("verify-otp/", verify_otp),
#     path("reset-password/", reset_password),


# ]


from django.urls import path
from .views import (
    RegisterAPIView,
    LoginAPIView,
    ForgotPasswordAPIView,
    VerifyOTPAPIView,
    ResetPasswordAPIView
)

urlpatterns = [
    path('register/', RegisterAPIView.as_view()),
    path('login/', LoginAPIView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('forgot-password/', ForgotPasswordAPIView.as_view()),
    path('verify-otp/', VerifyOTPAPIView.as_view()),
    path('reset-password/', ResetPasswordAPIView.as_view()),
]


# python -m celery -A core worker -l info