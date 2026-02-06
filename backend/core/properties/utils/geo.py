import math

def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius (km)

    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)

    a = (
        math.sin(d_lat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(d_lon / 2) ** 2
    )

    return 2 * R * math.asin(math.sqrt(a))


def get_nearby_pgs_with_distance(qs, lat, lng):
    pg_list = []

    for pg in qs:
        try:
            pg_lat, pg_lng = map(float, pg.latitude_longitude.split(","))
            pg.distance = haversine(lat, lng, pg_lat, pg_lng)
            pg_list.append(pg)
        except:
            continue

    return sorted(pg_list, key=lambda x: x.distance)
