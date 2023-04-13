from rest_framework import permissions, status
from rest_framework.generics import get_object_or_404, RetrieveAPIView
from rest_framework.response import Response

from property.models import Reservation
from property.serializers import FullReservationSerializer


class GetReservationView(RetrieveAPIView):
    serializer_class = FullReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        reservation = get_object_or_404(Reservation, id=pk)

        if reservation.client != request.user and reservation.property.user != request.user:
            return Response({'error': 'You do not have permission to view this reservation.'},
                            status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(reservation)
        return Response(serializer.data)
