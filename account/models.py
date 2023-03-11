from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class User(AbstractUser):
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=150)
    email = models.EmailField(max_length=254)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone = models.CharField(max_length=15)
    location = models.CharField(max_length=100)
    avatar_url = models.ImageField(upload_to='avatars/', blank=True, null=True)


class Notification(models.Model):
    msg = models.TextField()
    time = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)
    is_host = models.BooleanField()
    user_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_to', null=True)
    user_from = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_from', null=True)
