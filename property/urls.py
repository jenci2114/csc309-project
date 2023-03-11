from django.urls import path

from property.views.create_property import CreatePropertyView
from property.views.search_reservation import SearchView
from property.views.process_reservation import *
from property.views.update_property import UpdatePropertyView
from property.views.list_property import ListPropertyView
from property.views.comments_views import *
from property.views.delete_property import DeletePropertyView
from property.views.create_property import CreatePropertyView
from property.views.create_availability import CreateAvailabilityView
from property.views.update_availabiity import UpdateAvailabilityView
from property.views.delete_availability import DeleteAvailabilityView
from property.views.create_property_image import CreatePropertyImageView
from property.views.delete_property_image import DeletePropertyImageView


app_name = 'property'
urlpatterns = [
    path('create/', CreatePropertyView.as_view(), name='create'),
    path('reservation_search/', SearchView.as_view(), name='search'),
    path('reserve/', ReserveView.as_view(), name='reserve'),
    path('cancel/', CancelView.as_view(), name='cancel'),
    path('process_pending/', ProcessPendingView.as_view(), name='process_pending'),
    path('process_cancel/', ProcessCancelView.as_view(), name='process_cancel'),
    path('terminate/', TerminateView.as_view(), name='terminate_cancel'),
    path('update/<int:pk>/', UpdatePropertyView.as_view(), name='update'),
    path('search/', ListPropertyView.as_view(), name='search'),
    path('comments/property/<int:pk>/', PropertyCommentView.as_view(), name='view_property_comments'),
    path('comments/user/<int:pk>/', UserCommentView.as_view(), name='view_user_comments'),
    path('comments/add/reservation/<int:pk>/', CreateReservationCommentView.as_view(), name='add_reservation_comment'),
    path('reservation/<int:pk>/user_to_property_rating/', UpdateUserToPropertyRatingView.as_view(), name='user_to_property_rating'),
    path('reservation/<int:pk>/host_to_user_rating/', UpdateHostToUserRatingView.as_view(), name='host_to_user_rating'),
    path('reservation/<int:pk>/host_to_user_msg/', UpdateHostToUserMsgView.as_view(), name='host_to_user_msg)'),
    path('delete/<int:pk>/', DeletePropertyView.as_view(), name='delete'),
    path('availability/create/<int:pk>/', CreateAvailabilityView.as_view(), name='create_availability'),
    path('availability/update/<int:pk>/', UpdateAvailabilityView.as_view(), name='update_availability'),
    path('availability/delete/<int:pk>/', DeleteAvailabilityView.as_view(), name='delete_availability'),
    path('image/create/<int:pk>/', CreatePropertyImageView.as_view(), name='create_image'),
    path('image/delete/<int:pk>/', DeletePropertyImageView.as_view(), name='delete_image'),
]
