from django.db.models import Avg, Case, Max, Min, Value, When
from rest_framework.generics import ListAPIView

from backend.paginations import StandardResultsSetPagination
from property.models import Property, PropertyAvailability
from property.serializers import PropertySerializer
from backend.utils import datetime_check


class ListPropertyView(ListAPIView):
    serializer_class = PropertySerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = Property.objects.all()
        search = self.request.query_params.get('search', None)
        if search is not None:
            address_match = queryset.filter(address__icontains=search)
            city_match = queryset.filter(city__icontains=search)
            province_match = queryset.filter(province__icontains=search)
            zip_match = queryset.filter(zip__icontains=search)
            queryset = (address_match | city_match | province_match | zip_match).distinct()

        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        start_valid = start_date is not None and start_date != '' and datetime_check(start_date)
        end_valid = end_date is not None and end_date != '' and datetime_check(end_date)
        if start_valid and end_valid:
            queryset = queryset.filter(propertyavailability__start_date__lte=start_date,
                                       propertyavailability__end_date__gte=end_date)
        if start_valid and not end_valid:
            queryset = queryset.filter(propertyavailability__start_date__lte=start_date)
        if end_valid and not start_valid:
            queryset = queryset.filter(propertyavailability__end_date__gte=end_date)

        num_guests = self.request.query_params.get('num_guests', None)
        if num_guests is not None and num_guests.isdigit():
            queryset = queryset.filter(max_guests__gte=num_guests)

        num_beds = self.request.query_params.get('num_beds', None)
        if num_beds is not None and num_beds.isdigit():
            queryset = queryset.filter(beds=num_beds)

        num_bathrooms = self.request.query_params.get('num_bathrooms', None)
        if num_bathrooms is not None and num_bathrooms.isdigit():
            queryset = queryset.filter(bathrooms=num_bathrooms)

        order_by = self.request.query_params.get('order_by', None)
        if order_by is not None:
            if order_by == 'name_asc':
                queryset = queryset.order_by('city')
            elif order_by == 'name_desc':
                queryset = queryset.order_by('-city')
            elif order_by == 'price_asc':
                queryset = queryset.annotate(
                    min_price=Min('propertyavailability__price_per_night')
                ).annotate(
                    has_availability=Case(
                        When(propertyavailability__isnull=False, then=Value(1)),
                        default=Value(0),
                    )
                ).order_by('-has_availability', 'min_price')
            elif order_by == 'price_desc':
                queryset = queryset.annotate(max_price=Max('propertyavailability__price_per_night')).order_by('-max_price')
            elif order_by == 'rating':
                queryset = queryset.annotate(
                    avg_rating=Avg('reservation__user_to_property_rating')
                ).order_by('-avg_rating')

        return queryset
