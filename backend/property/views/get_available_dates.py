import datetime

from rest_framework.generics import get_object_or_404, ListAPIView
from rest_framework.response import Response

from backend.constants import *

from property.models import Property, PropertyAvailability, Reservation
from property.serializers import DatePriceSerializer


def generate_date_price_pairs(availabilities):
    date_price_pairs = []
    for availability in availabilities:
        current_date = availability.start_date
        while current_date <= availability.end_date:
            date_price_pairs.append({
                'date': current_date,
                'price': availability.price_per_night
            })
            current_date += datetime.timedelta(days=1)

    return date_price_pairs

class GetAvailableDatesView(ListAPIView):
    serializer_class = DatePriceSerializer

    def get_queryset(self):
        pk = self.kwargs['pk']
        property_instance = get_object_or_404(Property, pk=pk)
        return PropertyAvailability.objects.filter(property=property_instance)

    def list(self, request, *args, **kwargs):
        pk = self.kwargs['pk']
        property_instance = get_object_or_404(Property, pk=pk)

        availabilities = self.get_queryset()
        date_price_pairs = generate_date_price_pairs(availabilities)

        # Check if the date_price_pair is available (i.e. not reserved)
        valid_date_price_pairs = []
        for date_price_pair in date_price_pairs:
            date = date_price_pair['date']
            if Reservation.objects.filter(start_date__lte=date,
                                          end_date__gte=date,
                                          property=property_instance,
                                          status=PENDING):
                continue
            if Reservation.objects.filter(start_date__lte=date,
                                          end_date__gte=date,
                                          property=property_instance,
                                          status=APPROVED):
                continue
            if Reservation.objects.filter(start_date__lte=date,
                                          end_date__gte=date,
                                          property=property_instance,
                                          status=CANCELING):
                continue
            valid_date_price_pairs.append(date_price_pair)

        serializer = self.get_serializer(valid_date_price_pairs, many=True)
        return Response(serializer.data)
