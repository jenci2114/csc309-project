from django.contrib import admin

from .models import User, Notification

# Register your models here.
admin.site.register(User)
admin.site.register(Notification)
