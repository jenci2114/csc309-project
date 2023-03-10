from ..serializers import PropertyCommentSerializer
from ..models import PropertyComment, Reservation
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from collections import defaultdict


class PropertyCommentView(ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = PropertyCommentSerializer
    pagination_class = PageNumberPagination

    def get_queryset(self):
        # return all comments for a property, from property attribute in reservation
        return PropertyComment.objects.filter(reservation__property__id=self.kwargs['pk']).order_by('comment_number')

    def get(self, request, pk):
        # change all entries in the queryset to read = True once opened
        comment_group = defaultdict(list)
        for comment in self.get_queryset():
            comment_group[comment.reservation.id].append(comment)
        
        return Response(comment_group)
    

class CreateReservationCommentView(CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PropertyCommentSerializer

    def post(self, request, pk):
        # create a comment for a reservation
        if not Reservation.objects.filter(id=pk).exists():
            return Response(status=404)
        
        client = Reservation.objects.get(id=pk).client
        host = Reservation.objects.get(id=pk).property.user
        if self.request.user != client and self.request.user != host:
            return Response("You are not authorized to commen on this reservation",status=403)
        
        current_count = PropertyComment.objects.filter(reservation__id=pk).count()
        if self.request.user == client and current_count % 2 == 1:
            return Response("You need to wait for host to comment first", status=403)
        if self.request.user == host and current_count % 2 == 0:
            return Response("You need to wait for client to comment first", status=403)
        
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(msg=request.data.get('msg'),
                            reservation=Reservation.objects.get(id=pk),
                            comment_number=PropertyComment.objects.filter(reservation__id=pk).count() + 1)
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.errors, status=400)