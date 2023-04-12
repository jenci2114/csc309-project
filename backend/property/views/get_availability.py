from rest_framework.generics import ListAPIView

from property.models import PropertyAvailability
from property.serializers import AvailabilitySerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from property.models import Property


class GetAvailabilityView(ListAPIView):
    serializer_class = AvailabilitySerializer
    pagination_class = None

    def get_queryset(self):
        return PropertyAvailability.objects.filter(property_id=self.kwargs['pk']).order_by('start_date')
    
class GetSelfAvailabilityView(ListAPIView):
    serializer_class = AvailabilitySerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return PropertyAvailability.objects.filter(property_id=self.kwargs['pk']).order_by('start_date')
    
    def get(self, request, *args, **kwargs):
        property = get_object_or_404(Property, pk=self.kwargs['pk'])
        if property.user != self.request.user:
            return Response({'error': 'You do not have permission to view availabilities of this property.'}, status=403)
        return self.list(request, *args, **kwargs)
