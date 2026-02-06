from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import PropertiesDetails, RoomDetails, Complaint, RatingReview
from accounts.serializers import RegisterSerializer
User = get_user_model()

# class PgDetailSerializer(serializers.ModelSerializer):
#     user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)
#     class Meta:
#         model = PropertiesDetails
#         fields = '__all__'
#         read_only_fields = ['user']

class PgDetailSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)
    avg_rating = serializers.FloatField(read_only=True)
    distance = serializers.FloatField(read_only=True)

    class Meta:
        model = PropertiesDetails
        fields = "__all__"


class RoomDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomDetails
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

# class RatingReviewSerializer(serializers.ModelSerializer):
#     tenant = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)
#     pg = serializers.PrimaryKeyRelatedField(
#         queryset=PropertiesDetails.objects.all(),   
#         required=True
#     )
#     user =  RegisterSerializer(read_only=True)
#     pg_details = PgDetailSerializer(read_only=True)

#     class Meta:
#         model = RatingReview
#         fields = '__all__'
#         read_only_fields = ['created_at']

# class RatingReviewSerializer(serializers.ModelSerializer):
#     tenant = RegisterSerializer(read_only=True)  # return full user data
#     tenant_id = serializers.PrimaryKeyRelatedField(
#         queryset=User.objects.all(), write_only=True, source="tenant"
#     )

#     pg = serializers.PrimaryKeyRelatedField(queryset=PropertiesDetails.objects.all(), required=True)

#     class Meta:
#         model = RatingReview
#         fields = "__all__"
#         read_only_fields = ["created_at"]

class RatingReviewSerializer(serializers.ModelSerializer):
    tenant = RegisterSerializer(read_only=True)

    class Meta:
        model = RatingReview
        fields = ["id", "pg", "rating", "review", "tenant", "created_at"]
        read_only_fields = ["tenant", "created_at"]

class ComplaintsSerializer(serializers.ModelSerializer):
    tenant = RegisterSerializer(read_only=True)  # return full user data
    tenant_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), write_only=True, source="tenant"
    )

    pg = serializers.PrimaryKeyRelatedField(queryset=PropertiesDetails.objects.all(), required=True)

    class Meta:
        model = Complaint
        fields = "__all__"
        read_only_fields = ["created_at","updated_at"]
