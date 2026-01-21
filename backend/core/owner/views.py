from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import  OwnerDetail
from .serializers import OwnerDetailSerializer
from django.contrib.auth import get_user_model
from tenants.models import TenantDetail
from tenants.serializers import TenantDetailSerializer
from properties.models import PropertiesDetails
import json
from django.db.models import Q
from rest_framework.pagination import PageNumberPagination
from tenants.models import TenantPaymentDetail
from properties.models import Complaint
from owner.common.serializers import ComplaintsSerializer

User = get_user_model()

# Create your views here.
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class OwnerViewSet(viewsets.GenericViewSet):

    queryset = OwnerDetail.objects.all()
    serializer_class = OwnerDetailSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = StandardResultsSetPagination

    def list(self, request):
        qs = self.get_queryset()
        page = self.paginate_queryset(qs)

        if page is not None:
            serializer = self.get_serializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(qs, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        serializer = OwnerDetailSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
   
    @action(detail=False, methods=['get'], url_path='tenants-list/(?P<owner_id>[^/.]+)')
    def tenants_search_list(self, request, owner_id):
        search_term = request.query_params.get('search', '').strip()
        pg_ids = PropertiesDetails.objects.filter(user_id=owner_id).values_list('id', flat=True)
        if not pg_ids:
            return Response({"detail": "No PGs found for this owner."}, status=status.HTTP_404_NOT_FOUND)

        qs = TenantDetail.objects.filter(pg_id__in=pg_ids)
        if search_term:
            qs = qs.filter(
                Q(user__first_name__icontains=search_term) |
                Q(user__last_name__icontains=search_term) |
                Q(user__email__icontains=search_term) |
                Q(user__contact_number__icontains=search_term) |
                Q(homeContact__icontains=search_term) |
                Q(uniqueIDNumber__icontains=search_term)
            )
        qs = qs.select_related('user', 'pg', 'room').prefetch_related('charges')

        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = TenantDetailSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)

        # fallback if pagination not applied
        serializer = TenantDetailSerializer(qs, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='tenant-payments/(?P<owner_id>[^/.]+)/(?P<tenant_id>[^/.]+)')
    def tenants_payment_details(self, request, owner_id, tenant_id):
        try:
            pg_ids = PropertiesDetails.objects.filter(user_id=owner_id).values_list('id', flat=True)
            tenant = TenantDetail.objects.get(id=tenant_id, pg_id__in=pg_ids)
        except TenantDetail.DoesNotExist:
            return Response({"detail": "Tenant not found for this owner."}, status=status.HTTP_404_NOT_FOUND)

        payments = TenantPaymentDetail.objects.filter(tenant=tenant).order_by('-payment_date')
        payment_data = [
            {
                "txn_number":payment.transaction_id,
                "amount": payment.amount_paid,
                "payment_date": payment.payment_date,
                "payment_method": payment.payment_method,
                "remarks": payment.remarks
            }
            for payment in payments
        ]
        return Response({
            "tenant": TenantDetailSerializer(tenant, context={'request': request}).data,
            "payments": payment_data
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], url_path='complaints/(?P<owner_id>[^/.]+)')
    def properties_complaints(self, request, owner_id):
        
        pg_ids = PropertiesDetails.objects.filter(user_id=owner_id).values_list('id', flat=True)
        qs = Complaint.objects.filter(pg__in=pg_ids).order_by('-created_at')

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(qs, request)
        if page is not None:
            serializer = ComplaintsSerializer(page, many=True, context={'request': request})
            return paginator.get_paginated_response(serializer.data)

        serializer = ComplaintsSerializer(qs, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)