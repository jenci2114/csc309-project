from rest_framework.generics import get_object_or_404, RetrieveAPIView
from rest_framework.response import Response

from property.models import Property
from property.serializers import PropertySerializer


class GetPropertyView(RetrieveAPIView):
    serializer_class = PropertySerializer

    def retrieve(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        property = get_object_or_404(Property, id=pk)
        serializer = self.get_serializer(property)
        return Response(serializer.data)
