from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TenantViewSet, booking_orders

router = DefaultRouter()
router.register(r'', TenantViewSet, basename='pg')


urlpatterns = [
    path('', include(router.urls)),
    path('booking-orders/<int:user_id>/', booking_orders, name='booking_orders'),
]