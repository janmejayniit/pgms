from rest_framework import serializers
from .models import Order, Booking
from properties.models import PropertiesDetails, RoomDetails
from django.contrib.auth import get_user_model

User = get_user_model()

# class OrderSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Order
#         fields = "__all__"
#         read_only_fields = ("id", "created_at", "status")

class OrderSerializer(serializers.ModelSerializer):
    tenant = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )
    razorpay_order_id = serializers.CharField(read_only=True)
    currency = serializers.CharField(read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "pg",
            "room",
            "amount",
            "status",
            "tenant",
            "razorpay_order_id",
            "currency",
            "created_at",
        ]
        read_only_fields = [
            "tenant",
            "razorpay_order_id",
            "currency",
            "status",
            "created_at",
        ]


class BookingSerializer(serializers.ModelSerializer):
    tenant = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Booking
        fields = "__all__"
        read_only_fields = ["tenant", "status", "created_at", "notified"]

    def validate(self, data):
        room = data["room"]
        if not room.is_available:
            raise serializers.ValidationError("Room is not available")
        return data
