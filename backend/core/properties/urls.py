# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from .views import PropertiesViewSet, RoomViewSet, RatingViewSet, ComplaintsViewSet

# router = DefaultRouter()
# router.register(r'properties', PropertiesViewSet, basename='property')
# router.register(r'rooms', RoomViewSet, basename='room')
# router.register(r'rating',RatingViewSet, basename='rating' )
# router.register(r'complaint',ComplaintsViewSet, basename='complaint' )

# urlpatterns = [
#     path('', include(router.urls)),
# ]


from django.urls import path
from .views import (
    PgListCreateAPIView,
    PgRetrieveUpdateDeleteAPIView,
    RoomListCreateAPIView,
    RoomRetrieveUpdateDeleteAPIView,
    ComplaintCreateAPIView,
    ComplaintListAPIView,
    RatingReviewCreateAPIView,
    RatingReviewListAPIView,
    NearbyPGAPIView,
    RoomRetrieveAPIView,
)

urlpatterns = [
    # PG
    path('pg/', PgListCreateAPIView.as_view()),
    path('pg/<int:pk>/', PgRetrieveUpdateDeleteAPIView.as_view()),

    # Rooms
    path('pg/<int:pg_id>/rooms/', RoomListCreateAPIView.as_view()),
    path('rooms/<int:pk>/', RoomRetrieveUpdateDeleteAPIView.as_view()),
    path("pg/<int:pg_id>/rooms/<int:id>/",RoomRetrieveAPIView.as_view(),name="room-detail"),

    # Complaints
    path('complaints/', ComplaintListAPIView.as_view()),
    path('complaints/create/', ComplaintCreateAPIView.as_view()),

    # Ratings
    path('ratings/', RatingReviewListAPIView.as_view()),
    path('ratings/create/', RatingReviewCreateAPIView.as_view()),

    path("pg/nearby/", NearbyPGAPIView.as_view()),
]
