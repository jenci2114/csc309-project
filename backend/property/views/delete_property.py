from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import DestroyAPIView, get_object_or_404
from rest_framework.permissions import IsAuthenticated

from property.models import Property


class DeletePropertyView(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

    def get_object(self):
        return get_object_or_404(Property, pk=self.kwargs['pk'])

    def perform_destroy(self, instance):
        if self.request.user == instance.user:
            instance.delete()
        else:
            raise PermissionDenied('You do not have permission to delete this property.')
