from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

# Create your models here.
User = get_user_model()


class OwnerDetail(models.Model):
    PROOF_ID_CHOICES = [
        ('Aadhar Card', 'Aadhar Card'),
        ('PAN Card', 'PAN Card'),
        ('Driving License', 'Driving License'),
        ('Passport', 'Passport'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owner_profile')
    total_properties = models.IntegerField()
    photo = models.FileField(upload_to='owner_photos/', null=True, blank=True)
    proof_id_name = models.CharField(max_length=50, choices=PROOF_ID_CHOICES, default='Aadhar Card')
    photo_id_proof = models.FileField(upload_to='owner_id_proofs/', null=True, blank=True)
    country = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    address = models.TextField()
    is_verified = models.BooleanField(default=False)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)
        
    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} - OwnerDetail"




 

