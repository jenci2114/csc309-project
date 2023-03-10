from django.urls import path

from property.views.create_property import CreatePropertyView
from property.views.list_property import ListPropertyView
from property.views.update_property import UpdatePropertyView

app_name = 'property'
urlpatterns = [
    path('create/', CreatePropertyView.as_view(), name='create'),
    path('update/<int:pk>/', UpdatePropertyView.as_view(), name='update'),
    path('search/', ListPropertyView.as_view(), name='search'),
]
