import django_filters
from .models import PropertiesDetails, RoomDetails

class PropertyFilter(django_filters.FilterSet):
    address = django_filters.CharFilter(field_name="address", lookup_expr="icontains")
    country = django_filters.CharFilter(field_name="country", lookup_expr="iexact")
    state = django_filters.CharFilter(field_name="state", lookup_expr="iexact")
    city = django_filters.CharFilter(field_name="city", lookup_expr="iexact")
    pincode = django_filters.CharFilter(field_name="pincode", lookup_expr="exact")
    min_price = django_filters.NumberFilter(field_name="minium_charges", lookup_expr="gte")
    max_price = django_filters.NumberFilter(field_name="maximum_charges", lookup_expr="lte")

    class Meta:
        model = PropertiesDetails
        fields = [
                    "address", 
                    "min_price", 
                    "max_price",
                    "country",
                    "state",
                    "city",
                    "pincode",
                ]

class RoomFilter(django_filters.FilterSet):
    min_rent = django_filters.NumberFilter(field_name="monthly_rent", lookup_expr="gte")
    max_rent = django_filters.NumberFilter(field_name="monthly_rent", lookup_expr="lte")
    is_available = django_filters.BooleanFilter(field_name="is_available")

    class Meta:
        model = RoomDetails
        fields = ["is_available", "min_rent", "max_rent"]
