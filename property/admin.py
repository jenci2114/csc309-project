from django.contrib import admin

# Register your models here.
from .models import Property, propertyImage, PropertyAvailability, Reservation, PropertyComment
# Register your models here.
admin.site.register(Property)
admin.site.register(propertyImage)
admin.site.register(PropertyAvailability)
admin.site.register(Reservation)
admin.site.register(PropertyComment)

