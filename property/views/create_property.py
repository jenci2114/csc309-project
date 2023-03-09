from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated

from property.serializers import PropertySerializer


class CreatePropertyView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PropertySerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
