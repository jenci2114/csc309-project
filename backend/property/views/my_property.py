from rest_framework.generics import ListAPIView
from property.serializers import PropertySerializer
from rest_framework.permissions import IsAuthenticated
from property.models import Property


class MyPropertyView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PropertySerializer
    pagination_class = None

    def get_queryset(self):
        queryset = Property.objects.filter(user=self.request.user)
        return queryset
