from django.urls import path
from property.views.create_availability import CreateAvailabilityView
from property.views.create_property import CreatePropertyView
from property.views.create_property_image import CreatePropertyImageView
from property.views.delete_availability import DeleteAvailabilityView
from property.views.delete_property import DeletePropertyView
from property.views.delete_property_image import DeletePropertyImageView
from property.views.list_property import ListPropertyView
from property.views.update_availabiity import UpdateAvailabilityView
from property.views.update_property import UpdatePropertyView
from property.views.comments_views import PropertyCommentView, CreateReservationCommentView

app_name = 'property'
urlpatterns = [
    path('create/', CreatePropertyView.as_view(), name='create'),
    path('update/<int:pk>/', UpdatePropertyView.as_view(), name='update'),
    path('search/', ListPropertyView.as_view(), name='search'),
    path('comments/<int:pk>/', PropertyCommentView.as_view(), name='view_property_comments'),
    path('comments/add/reservation/<int:pk>/', CreateReservationCommentView.as_view(), name='add_reservation_comment'),
    path('delete/<int:pk>/', DeletePropertyView.as_view(), name='delete'),
    path('availability/create/<int:pk>/', CreateAvailabilityView.as_view(), name='create_availability'),
    path('availability/update/<int:pk>/', UpdateAvailabilityView.as_view(), name='update_availability'),
    path('availability/delete/<int:pk>/', DeleteAvailabilityView.as_view(), name='delete_availability'),
    path('image/create/<int:pk>/', CreatePropertyImageView.as_view(), name='create_image'),
    path('image/delete/<int:pk>/', DeletePropertyImageView.as_view(), name='delete_image'),
]
