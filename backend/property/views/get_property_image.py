from rest_framework.generics import ListAPIView

from property.models import PropertyImage, Property
from property.serializers import PropertyImageSerializer
from backend.paginations import StandardResultsSetPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

class GetPropertyImageView(ListAPIView):
    serializer_class = PropertyImageSerializer
    pagination_class = None

    def get_queryset(self):
        return PropertyImage.objects.filter(property_id=self.kwargs['pk'])
    
class GetSelfPropertyImageView(ListAPIView):
    serializer_class = PropertyImageSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return PropertyImage.objects.filter(property_id=self.kwargs['pk'])
    

    def get(self, request, *args, **kwargs):
        property = get_object_or_404(Property, pk=self.kwargs['pk'])
        if property.user != self.request.user:
            return Response({'error': 'You do not have permission to view this property.'}, status=403)
        return self.list(request, *args, **kwargs)
