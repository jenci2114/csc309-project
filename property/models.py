from django.db import models
from account.models import User


class Property(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    province = models.CharField(max_length=100)
    zip = models.CharField(max_length=10)
    beds = models.IntegerField()
    bathrooms = models.IntegerField()
    max_guests = models.IntegerField()
    description = models.TextField()
    image_url = models.URLField()


class PropertyAvailability(models.Model):
    start_date = models.DateField()
    end_date = models.DateField()
    price_per_night = models.DecimalField(max_digits=8, decimal_places=2)
    property = models.ForeignKey(Property, on_delete=models.CASCADE)


class Reservation(models.Model):
    host = models.ForeignKey(User, on_delete=models.CASCADE)
    client = models.ForeignKey(User, on_delete=models.CASCADE)
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    total_price = models.DecimalField(max_digits=8, decimal_places=2)
    status = models.CharField(max_length=50, default='pending')
    start_date = models.DateField()
    end_date = models.DateField()
    host_to_user_msg = models.TextField(blank=True)
    host_to_user_rating = models.IntegerField(null=True, blank=True)
    user_to_property_rating = models.IntegerField(null=True, blank=True)
    number_of_property_comment = models.IntegerField(default=0)


class PropertyComment(models.Model):
    msg = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE)
    comment_number = models.IntegerField()


class Notification(models.Model):
    msg = models.TextField()
    time = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)
    is_host = models.BooleanField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
