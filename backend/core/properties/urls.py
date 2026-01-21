from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PropertiesViewSet, RoomViewSet, RatingViewSet, ComplaintsViewSet

router = DefaultRouter()
router.register(r'properties', PropertiesViewSet, basename='property')
router.register(r'rooms', RoomViewSet, basename='room')
router.register(r'rating',RatingViewSet, basename='rating' )
router.register(r'complaint',ComplaintsViewSet, basename='complaint' )

urlpatterns = [
    path('', include(router.urls)),
]
