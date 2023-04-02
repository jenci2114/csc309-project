from django.contrib import admin

# Register your models here.
from .models import Property, PropertyImage, PropertyAvailability, Reservation, PropertyComment
# Register your models here.
admin.site.register(Property)
admin.site.register(PropertyImage)
admin.site.register(PropertyAvailability)
admin.site.register(Reservation)
admin.site.register(PropertyComment)

