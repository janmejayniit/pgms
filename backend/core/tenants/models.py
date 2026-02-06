from django.db import models

# Create your models here.
class TenantDetail(models.Model):
    id = models.BigAutoField(primary_key=True)
    homecontact = models.CharField(db_column='homeContact', max_length=15)  # Field name made lowercase.
    permanentaddress = models.TextField(db_column='permanentAddress')  # Field name made lowercase.
    idname = models.CharField(db_column='IdName', max_length=100)  # Field name made lowercase.
    uniqueidnumber = models.CharField(db_column='uniqueIDNumber', unique=True, max_length=100)  # Field name made lowercase.
    tenantphoto = models.CharField(db_column='tenantPhoto', max_length=100, blank=True, null=True)  # Field name made lowercase.
    addressproof = models.CharField(db_column='addressProof', max_length=100, blank=True, null=True)  # Field name made lowercase.
    rent_type = models.CharField(max_length=10)
    status = models.CharField(max_length=50)
    joined_date = models.DateField()
    vacated_date = models.DateField(blank=True, null=True)
    pg = models.ForeignKey('properties.PropertiesDetails', on_delete=models.CASCADE)
    room = models.ForeignKey('properties.RoomDetails', on_delete=models.CASCADE)
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE)


class TenantCharge(models.Model):
    id = models.BigAutoField(primary_key=True)
    charge_type = models.CharField(max_length=20)
    description = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    is_recurring = models.IntegerField()
    created_at = models.DateTimeField()
    tenant = models.ForeignKey('accounts.User', on_delete=models.CASCADE)


class TenantPaymentDetail(models.Model):
    id = models.BigAutoField(primary_key=True)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField()
    payment_method = models.CharField(max_length=50)
    transaction_id = models.CharField(unique=True, max_length=100)
    remarks = models.TextField(blank=True, null=True)
    pg = models.ForeignKey('properties.PropertiesDetails', on_delete=models.CASCADE)
    room = models.ForeignKey('properties.RoomDetails', on_delete=models.CASCADE)
    tenant = models.ForeignKey('accounts.User', on_delete=models.CASCADE)

class TenantOldDetail(models.Model):
    id = models.BigAutoField(primary_key=True)
    joined_date = models.DateField()
    vacated_date = models.DateField()
    pg = models.ForeignKey('properties.PropertiesDetails', models.DO_NOTHING)
    room = models.ForeignKey('properties.RoomDetails', models.DO_NOTHING)
    tenant = models.ForeignKey('accounts.User', models.DO_NOTHING)
