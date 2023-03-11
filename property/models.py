from django.db import models
from account.models import User


class Property(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    province = models.CharField(max_length=100)
    zip = models.CharField(max_length=10)
    beds = models.PositiveIntegerField()
    bathrooms = models.PositiveIntegerField()
    max_guests = models.PositiveIntegerField()
    description = models.TextField()

class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='property_images/')


class PropertyAvailability(models.Model):
    start_date = models.DateField()
    end_date = models.DateField()
    price_per_night = models.DecimalField(max_digits=8, decimal_places=2)
    property = models.ForeignKey(Property, on_delete=models.CASCADE)


class Reservation(models.Model):
    client = models.ForeignKey(User, on_delete=models.CASCADE)
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    total_price = models.DecimalField(max_digits=8, decimal_places=2)
    status = models.CharField(max_length=50, default='pending')
    start_date = models.DateField()
    end_date = models.DateField()
    host_to_user_msg = models.TextField(null=True, blank=True)
    host_to_user_rating = models.PositiveIntegerField(null=True, blank=True)
    user_to_property_rating = models.PositiveIntegerField(null=True, blank=True)


class PropertyComment(models.Model):
    msg = models.TextField()
    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE)
    comment_number = models.PositiveIntegerField()
