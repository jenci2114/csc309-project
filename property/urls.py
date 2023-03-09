from django.urls import path

from property.views.create_property import CreatePropertyView


app_name = 'property'
urlpatterns = [
    path('create/', CreatePropertyView.as_view(), name='create'),
]
