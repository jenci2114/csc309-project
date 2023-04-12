from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.generics import CreateAPIView, get_object_or_404
from rest_framework.permissions import IsAuthenticated

from property.models import Property, PropertyAvailability
from property.serializers import AvailabilitySerializer


class CreateAvailabilityView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AvailabilitySerializer

    def get_object(self):
        return get_object_or_404(Property, pk=self.kwargs['pk'])

    def perform_create(self, serializer):
        if self.request.user == self.get_object().user:
            if serializer.validated_data['start_date'] > serializer.validated_data['end_date']:
                raise ValidationError('Start date must be before end date.')

            conflicts = PropertyAvailability.objects.filter(
                start_date__lte=serializer.validated_data['end_date'],
                start_date__gte=serializer.validated_data['start_date'],
                property_id=self.get_object().id
            ) | PropertyAvailability.objects.filter(
                end_date__lte=serializer.validated_data['end_date'],
                end_date__gte=serializer.validated_data['start_date'],
                property_id=self.get_object().id
            ) | PropertyAvailability.objects.filter(
                start_date__lte=serializer.validated_data['start_date'],
                end_date__gte=serializer.validated_data['end_date'],
                property_id=self.get_object().id
            )

            if conflicts.exists():
                raise ValidationError('This availability conflicts with another availability.')

            serializer.save(property=self.get_object())
        else:
            raise PermissionDenied('You do not have permission to create this availability.')
