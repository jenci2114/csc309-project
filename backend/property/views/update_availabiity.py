from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.generics import get_object_or_404, UpdateAPIView
from rest_framework.permissions import IsAuthenticated

from property.models import PropertyAvailability
from property.serializers import AvailabilitySerializer


class UpdateAvailabilityView(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AvailabilitySerializer

    def get_object(self):
        return get_object_or_404(PropertyAvailability, pk=self.kwargs['pk'])

    def perform_update(self, serializer):
        if 'start_date' not in serializer.validated_data:
            serializer.validated_data['start_date'] = self.get_object().start_date
        if 'end_date' not in serializer.validated_data:
            serializer.validated_data['end_date'] = self.get_object().end_date

        if self.request.user == self.get_object().property.user:
            if serializer.validated_data['start_date'] > serializer.validated_data['end_date']:
                raise ValidationError('Start date must be before end date.')

            conflicts = PropertyAvailability.objects.filter(
                start_date__lte=serializer.validated_data['end_date'],
                start_date__gte=serializer.validated_data['start_date'],
                property_id=self.get_object().property.id
            ) | PropertyAvailability.objects.filter(
                end_date__lte=serializer.validated_data['end_date'],
                end_date__gte=serializer.validated_data['start_date'],
                property_id=self.get_object().property.id
            )

            conflicts = conflicts.exclude(pk=self.get_object().id)

            if conflicts.exists():
                raise ValidationError('This availability conflicts with another availability.')

            serializer.save()
        else:
            raise PermissionDenied('You do not have permission to edit this availability.')
