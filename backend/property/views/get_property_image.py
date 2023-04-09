from rest_framework.generics import ListAPIView

from property.models import PropertyImage
from property.serializers import PropertyImageSerializer
from backend.paginations import StandardResultsSetPagination

class GetPropertyImageView(ListAPIView):
    serializer_class = PropertyImageSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return PropertyImage.objects.filter(property_id=self.kwargs['pk'])
