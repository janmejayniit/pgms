from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions

from .utils.utility import haversine
from .models import PropertiesDetails, RoomDetails, RatingReview, Complaint
from .serializers import PgDetailSerializer, RoomDetailSerializer, RatingReviewSerializer, ComplaintsSerializer
from .permissions import IsOwnerOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from .filters import PropertyFilter, RoomFilter
from rest_framework.filters import SearchFilter
from .permissions import IsTenant, IsOwner
from .utils.utility import get_nearby_pgs
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

class PgListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = PgDetailSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = PropertyFilter
    search_fields = [
        "pg_name",
        "address",
        "city",
        "state",
        "country",
        "pincode",
    ]

    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        qs = PropertiesDetails.objects.all()

        # Availability filter (optional)
        available = self.request.query_params.get("available")
        if available == "1":
            qs = qs.filter(roomdetails__is_available=1).distinct()

        # Latitude / Longitude filter (optional)
        lat = self.request.query_params.get("lat")
        lng = self.request.query_params.get("lng")
        radius = self.request.query_params.get("radius", 5)

        if lat and lng:
            qs = get_nearby_pgs(qs, float(lat), float(lng), float(radius))

        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PgRetrieveUpdateDeleteAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PropertiesDetails.objects.all()
    serializer_class = PgDetailSerializer
    
    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsOwnerOrReadOnly()]

class NearbyPGAPIView(generics.ListAPIView):
    serializer_class = PgDetailSerializer
    def get_queryset(self):
        lat = float(self.request.query_params.get("lat"))
        lng = float(self.request.query_params.get("lng"))
        radius = float(self.request.query_params.get("radius", 5))
        qs = PropertiesDetails.objects.all()
        return [
            pg for pg in qs
            if haversine(lat, lng, pg.latitude, pg.longitude) <= radius
        ]


class RoomListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = RoomDetailSerializer
    filterset_class = RoomFilter
    # permission_classes = [permissions.IsAuthenticated]
    permission_classes=[permissions.AllowAny]

    def get_queryset(self):
        return RoomDetails.objects.filter(
            pg_id=self.kwargs.get('pg_id')
        )

    def list(self, request, *args, **kwargs):

        rooms = self.get_queryset()
        pg = PropertiesDetails.objects.get(id=self.kwargs.get('pg_id'))

        return Response({
            "pg": PgDetailSerializer(pg).data,
            "rooms": self.get_serializer(rooms, many=True).data
        })

    def perform_create(self, serializer):
        serializer.save(pg_id_id=self.kwargs.get('pg_id'))

class RoomRetrieveAPIView(generics.RetrieveAPIView):
    serializer_class = RoomDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "id"

    def get_queryset(self):
        return RoomDetails.objects.filter(
            pg_id=self.kwargs.get("pg_id")
        )

class RoomRetrieveUpdateDeleteAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RoomDetails.objects.all()
    serializer_class = RoomDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

class ComplaintCreateAPIView(generics.CreateAPIView):
    serializer_class = ComplaintsSerializer
    permission_classes = [permissions.IsAuthenticated, IsTenant]
    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user)

class ComplaintListAPIView(generics.ListAPIView):
    serializer_class = ComplaintsSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        # Owner sees complaints of his PGs
        if user.is_owner:
            return Complaint.objects.filter(pg__user=user)
        # Tenant sees own complaints
        return Complaint.objects.filter(tenant=user)

class RatingReviewCreateAPIView(generics.CreateAPIView):
    serializer_class = RatingReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
    # permission_classes = [permissions.IsAuthenticated, IsTenant]
    def perform_create(self, serializer):
        try:
            serializer.save(tenant=self.request.user)
        except ValidationError:
            raise
        except Exception as str:
            raise ValidationError({"detail": str})

class RatingReviewListAPIView(generics.ListAPIView):
    serializer_class = RatingReviewSerializer
    permission_classes = [permissions.AllowAny]
    def get_queryset(self):
        pg_id = self.request.query_params.get('pg')
        queryset = RatingReview.objects.all()
        if pg_id:
            queryset = queryset.filter(pg_id=pg_id)
        return queryset
