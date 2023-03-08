from django.db import models
from django.contrib.auth.models import AbstractUser, Group


# Create your models here.
class User(AbstractUser):
    # username = models.CharField(max_length=150, unique=True)
    # email = models.EmailField(max_length=254)
    # first_name = models.CharField(max_length=30)
    # last_name = models.CharField(max_length=30)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    phone = models.CharField(max_length=15)
    location = models.CharField(max_length=100)
    #
    # groups = models.ManyToManyField(
    #     Group,
    #     verbose_name='groups',
    #     blank=True,
    #     help_text='The groups this user belongs to. A user will '
    #               'get all permissions granted to each of their groups.',
    #     related_name='custom_user_set',  # add a related_name argument
    #     related_query_name='custom_user',
    # )
