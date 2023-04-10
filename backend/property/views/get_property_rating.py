from django.db.models import Avg
from rest_framework.response import Response
from rest_framework import status
from ..models import Reservation
from rest_framework.views import APIView

class GetPropertyRatingView(APIView):
    model = Reservation

    def get_queryset(self, pk):
        return Reservation.objects.filter(property_id=pk)

    def get(self, request, pk):
        queryset = self.get_queryset(pk)

        if queryset.exists():
            average_rating = queryset.aggregate(Avg('user_to_property_rating')).get('user_to_property_rating__avg')
            if average_rating is not None:
                return Response({'rating': round(average_rating, 2)}, status=status.HTTP_200_OK)
            else:
                return Response({'rating': "No ratings available"}, status=status.HTTP_200_OK)
        else:
            return Response({'rating': "No ratings available"}, status=status.HTTP_200_OK)
