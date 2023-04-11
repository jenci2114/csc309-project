from django.db.models import Avg
from rest_framework.response import Response
from rest_framework import status
from ..models import Reservation, User
from rest_framework.views import APIView

class GetUserRatingView(APIView):
    model = Reservation

    def get_queryset(self, pk):
        user = User.objects.filter(username=pk)
        if user.exists():
            user_pk = user[0].pk
            print('1')
            return Reservation.objects.filter(client=user_pk)
        else:
            print('2')
            return Reservation.objects.filter(client=-1)

    def get(self, request, pk):
        queryset = self.get_queryset(pk)

        if queryset.exists():
            average_rating = queryset.aggregate(Avg('host_to_user_rating')).get('host_to_user_rating__avg')
            if average_rating is not None:
                return Response({'rating': str(round(average_rating, 2))}, status=status.HTTP_200_OK)
            else:
                return Response({'rating': "No ratings available"}, status=status.HTTP_200_OK)
        else:
            return Response({'rating': "No ratings available"}, status=status.HTTP_200_OK)