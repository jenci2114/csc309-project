from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import CreateAPIView, get_object_or_404
from rest_framework.permissions import IsAuthenticated

from property.models import Property
from property.serializers import PropertyImageSerializer


class CreatePropertyImageView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PropertyImageSerializer

    def get_object(self):
        return get_object_or_404(Property, pk=self.kwargs['pk'])

    def perform_create(self, serializer):
        if self.request.user == self.get_object().user:
            serializer.save(property=self.get_object())
        else:
            raise PermissionDenied('You do not have permission to create this image.')
