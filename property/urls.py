from django.urls import path
from property.views.create_availability import CreateAvailabilityView
from property.views.create_property import CreatePropertyView
from property.views.delete_property import DeletePropertyView
from property.views.list_property import ListPropertyView
from property.views.update_availabiity import UpdateAvailabilityView
from property.views.update_property import UpdatePropertyView

app_name = 'property'
urlpatterns = [
    path('create/', CreatePropertyView.as_view(), name='create'),
    path('update/<int:pk>/', UpdatePropertyView.as_view(), name='update'),
    path('search/', ListPropertyView.as_view(), name='search'),
    path('delete/<int:pk>/', DeletePropertyView.as_view(), name='delete'),
    path('availability/create/<int:pk>/', CreateAvailabilityView.as_view(), name='create_availability'),
    path('availability/update/<int:pk>/', UpdateAvailabilityView.as_view(), name='update_availability'),
]
