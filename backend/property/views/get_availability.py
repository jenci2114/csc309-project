from rest_framework.generics import ListAPIView

from property.models import PropertyAvailability
from property.serializers import AvailabilitySerializer


class GetAvailabilityView(ListAPIView):
    serializer_class = AvailabilitySerializer
    pagination_class = None

    def get_queryset(self):
        return PropertyAvailability.objects.filter(property_id=self.kwargs['pk'])
