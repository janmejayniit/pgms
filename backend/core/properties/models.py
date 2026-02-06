from django.db import models

# Create your models here.
class PropertiesDetails(models.Model):
    id = models.BigAutoField(primary_key=True)
    pg_name = models.CharField(max_length=100)
    total_rooms = models.IntegerField()
    address = models.TextField(blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    pg_photo = models.CharField(max_length=100, blank=True, null=True)
    video_tour = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField()
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    amenities = models.TextField(blank=True, null=True)
    maximum_charges = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    minium_charges = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    pincode = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        indexes = [
            models.Index(fields=["latitude", "longitude"]),
            models.Index(fields=["country"]),
            models.Index(fields=["state"]),
            models.Index(fields=["city"]),
            models.Index(fields=["pincode"]),
        ]

    def __str__(self):
        return self.pg_name

class RoomDetails(models.Model):
    id = models.BigAutoField(primary_key=True)
    room_number = models.CharField(max_length=30)
    floor = models.IntegerField()
    room_type = models.CharField(max_length=50)
    capacity = models.PositiveIntegerField()
    current_occupancy = models.PositiveIntegerField()
    monthly_rent = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    daily_rent = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    status = models.CharField(max_length=20)
    amenities = models.TextField(blank=True, null=True)
    room_photo = models.CharField(max_length=100, blank=True, null=True)
    room_videos = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    pg = models.ForeignKey(PropertiesDetails, on_delete=models.CASCADE)
    is_available = models.IntegerField()

    class Meta:
        unique_together = (('pg', 'room_number'),)
    
    def __str__(self):
        return f'{self.pg}-{self.floor}-{self.room_number}'
    
    def save(self, *args, **kwargs):
        self.is_available = 1 if self.current_occupancy < self.capacity else 0
        super().save(*args, **kwargs)

class Complaint(models.Model):
    id = models.BigAutoField(primary_key=True)
    subject = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=50)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    tenant = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    pg = models.ForeignKey(PropertiesDetails, on_delete=models.CASCADE)


class RatingReview(models.Model):
    id = models.BigAutoField(primary_key=True)
    rating = models.PositiveIntegerField()
    review = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    pg = models.ForeignKey(PropertiesDetails, on_delete=models.CASCADE)
    tenant = models.ForeignKey('accounts.User', on_delete=models.CASCADE)

    class Meta:
        unique_together = (('tenant', 'pg'),)