from rest_framework import serializers
from .models import PaymentDetails, Notification
from django.contrib.auth import get_user_model
User = get_user_model()


class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "first_name", "last_name", "email")

# class OrderSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Order
#         fields = "__all__"
#         read_only_fields = ("id", "created_at", "status")

# class OrderDetailSerializer(serializers.ModelSerializer):
#     from properties.serializers import RoomDetailSerializer, PgDetailSerializer
#     tenant = UserMiniSerializer(read_only=True)
#     pg = PgDetailSerializer(read_only=True)
#     class Meta:
#         model = Order
#         fields = "__all__"


# class BookingSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Booking
#         fields = "__all__"
#         read_only_fields = ("id", "status", "created_at", "notified")

# class BookingDetailSerializer(serializers.ModelSerializer):
#     # tenant = UserMiniSerializer(read_only=True)
#     order = OrderDetailSerializer(read_only=True)

#     class Meta:
#         model = Booking
#         fields = "__all__"


# class PaymentCreateSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = PaymentDetails
#         fields = (
#             "order",
#             "tenant",
#             "pg",
#             "room",
#             "amount_paid",
#             "payment_method",
#             "transaction_id",
#             "remarks",
#         )

# class PaymentDetailserializer(serializers.ModelSerializer):
#     tenant = UserMiniSerializer(read_only=True)
#     order = OrderDetailSerializer(read_only=True)

#     class Meta:
#         model = PaymentDetails
#         fields = "__all__"

class PaymentDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentDetails
        fields = "__all__"
        read_only_fields = fields

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = "__all__"
        read_only_fields = ["created_at", "user"]




from rest_framework import serializers
from .models import Invoice, Refund

class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = "__all__"


class RefundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Refund
        fields = "__all__"
