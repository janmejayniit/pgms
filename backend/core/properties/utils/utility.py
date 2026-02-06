from math import radians, cos, sin, asin, sqrt
from django.db.models import F, FloatField, ExpressionWrapper
from django.db.models.functions import ACos, Cos, Radians, Sin

def haversine(lat1, lon1, lat2, lon2):
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    return 6371 * c  # KM


def get_nearby_pgs(queryset, latitude, longitude, radius_km=5):
    return queryset.annotate(
        distance=ExpressionWrapper(
            6371 * ACos(
                Cos(Radians(latitude)) *
                Cos(Radians(F('latitude'))) *
                Cos(Radians(F('longitude')) - Radians(longitude)) +
                Sin(Radians(latitude)) *
                Sin(Radians(F('latitude')))
            ),
            output_field=FloatField()
        )
    ).filter(distance__lte=radius_km).order_by('distance')