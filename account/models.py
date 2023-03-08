from django.db import models
from django.contrib.auth.models import AbstractUser, Group


# Create your models here.
class User(AbstractUser):
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=150)
    email = models.EmailField(max_length=254)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    phone = models.CharField(max_length=15)
    location = models.CharField(max_length=100)
    avatar_url = models.ImageField(upload_to='avatars/', blank=True, null=True)


class Notification(models.Model):
    msg = models.TextField()
    time = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)
    is_host = models.BooleanField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
