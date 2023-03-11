from django.urls import path

from property.views.create_property import CreatePropertyView
from property.views.search_reservation import SearchView
from property.views.process_reservation import *


app_name = 'property'
urlpatterns = [
    path('create/', CreatePropertyView.as_view(), name='create'),
    path('reservation_search/', SearchView.as_view(), name='search'),
    path('reserve/', ReserveView.as_view(), name='reserve'),
    path('cancel/', CancelView.as_view(), name='cancel'),
    path('process_pending/', ProcessPendingView.as_view(), name='process_pending'),
    path('process_cancel/', ProcessCancelView.as_view(), name='process_cancel'),
    path('terminate/', TerminateView.as_view(), name='terminate_cancel'),
]
