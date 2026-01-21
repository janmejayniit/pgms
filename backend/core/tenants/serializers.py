from rest_framework import serializers
from .models import TenantDetail, TenantOldDetail, TenantCharge
from accounts.serializers import RegisterSerializer
from django.contrib.auth import get_user_model
from properties.models import RoomDetails,PropertiesDetails
# from .utils.face_utils import is_human_face, are_faces_same
from properties.serializers import PgDetailSerializer, RoomDetailSerializer
User = get_user_model()

class TenantChargeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenantCharge
        fields = ['charge_type', 'description', 'amount']


class TenantDetailSerializer(serializers.ModelSerializer):
    from properties.models import PropertiesDetails
    user = RegisterSerializer()  # Nested user serializer
    # pg = serializers.PrimaryKeyRelatedField(queryset=PropertiesDetails.objects.all(), required=False)
    # charges = TenantChargeSerializer(many=True, read_only=True)
    # room = serializers.PrimaryKeyRelatedField(queryset=RoomDetails.objects.all(), required=False)

    pg = PgDetailSerializer(read_only=True)
    room = RoomDetailSerializer(read_only=True)
    charges = TenantChargeSerializer(many=True, read_only=True)


    # WRITE-ONLY FIELDS for create()
    pg_id = serializers.PrimaryKeyRelatedField(
        source="pg",
        queryset=PropertiesDetails.objects.all(),
        write_only=True
    )
    room_id = serializers.PrimaryKeyRelatedField(
        source="room",
        queryset=RoomDetails.objects.all(),
        write_only=True
    )

    class Meta:
        model = TenantDetail
        fields = '__all__'

    # def validate(self, data):
    #     tenant_photo = data.get('tenantPhoto')
    #     address_proof = data.get('addressProof')

    #     # Validate tenant face photo
    #     if tenant_photo:
    #         if not is_human_face(tenant_photo.path):
    #             raise serializers.ValidationError(
    #                 {"tenantPhoto": "Please upload a clear photo with exactly one human face."}
    #             )

    #     # Validate ID proof face (if available)
    #     if tenant_photo and address_proof:
    #         same_person = are_faces_same(tenant_photo.path, address_proof.path)
    #         if not same_person:
    #             raise serializers.ValidationError(
    #                 {"addressProof": "Face in ID proof does not match the tenant photo."}
    #             )
    #     return data
    
    def create(self, validated_data):
        # print('Validated data ',validated_data)
        # Extract nested user
        user_data = validated_data.pop("user")

        # Validate duplicate email
        if User.objects.filter(email=user_data["email"]).exists():
            raise serializers.ValidationError({"user": "User with this email already exists."})

        # Create User
        user_serializer = RegisterSerializer(data=user_data)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()

        # Extract pg_id and room_id from validated_data
        pg = validated_data.pop("pg")
        room = validated_data.pop("room")

        # Create tenant with linked user, pg and room
        tenant = TenantDetail.objects.create(
            user=user,
            pg=pg,
            room=room,
            **validated_data
        )

        return tenant
        
class TenantOldDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenantOldDetail
        fields = '__all__'