from rest_framework import serializers
from accounts.serializers import RegisterSerializer
from tenants.serializers import TenantDetailSerializer
from properties.serializers import PgDetailSerializer
from properties.models import Complaint


class ComplaintsSerializer(serializers.ModelSerializer):
    user = RegisterSerializer(read_only=True)
    # pg = PgDetailSerializer(read_only=True)
    tenant = TenantDetailSerializer(read_only=True)

    class Meta:
        model = Complaint
        fields = '__all__'