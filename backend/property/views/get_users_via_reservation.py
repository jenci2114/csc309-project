from rest_framework.views import APIView
from rest_framework import permissions
from ..models import Reservation, User
from rest_framework.response import Response

class UsersByReservationView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        if not Reservation.objects.filter(id=pk).exists():
            return Response(status=404)
        reservation = Reservation.objects.get(id=pk)
        return Response({
            'host': reservation.property.user.username,
            'tenant': reservation.client.username
        })
