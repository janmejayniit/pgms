from rest_framework import serializers
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from .models import OwnerDetail
User = get_user_model()

class OwnerDetailSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    class Meta:
        model = OwnerDetail
        fields = '__all__'


class OwnerLoginSerializer(TokenObtainPairSerializer):
    contact_number = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        contact_number = attrs.get('contact_number')
        password = attrs.get('password')

        try:
            owner = OwnerDetail.objects.get(contact_number=contact_number)
            user = owner.user
        except OwnerDetail.DoesNotExist:
            raise serializers.ValidationError({"contact_number": "Invalid contact number"})

        if not user.check_password(password):
            raise serializers.ValidationError({"password": "Invalid password"})

        # Authenticate via username internally
        data = super().validate({
            'username': user.username,
            'password': password
        })

        data['owner'] = {
            "email": user.email,
            "contact_number": contact_number,
            "id": user.id
        }
        return data
