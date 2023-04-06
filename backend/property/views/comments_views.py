from ..serializers import PropertyCommentSerializer, ReservationUserToPropertyRatingSerializer, ReservationHostToUserRatingSerializer, ReservationHostToUserMsgSerializer, UserCommentSerializer
from ..models import PropertyComment, Reservation, Property
from account.models import User, Notification
from rest_framework.generics import ListAPIView, CreateAPIView, UpdateAPIView
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from collections import defaultdict
from rest_framework.generics import get_object_or_404


class CommentsPagination(PageNumberPagination):
    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })

class PropertyCommentView(ListAPIView):
    permission_classes = [permissions.AllowAny]
    pagination_class = CommentsPagination
    pagination_class.page_size = 1
    lookup_field = 'pk'

    def get_queryset(self):
        # return all comments for a property, from property attribute in reservation
        get_object_or_404(Property, id=self.kwargs['pk'])
        return PropertyComment.objects.filter(reservation__property__id=self.kwargs['pk']).order_by('comment_number')

    def get(self, request, pk):
        # change all entries in the queryset to read = True once opened
        comment_group = defaultdict(list)
        for comment in self.get_queryset():
            comment_group[comment.reservation.id].append({
                'msg': comment.msg,
                'comment_number': comment.comment_number,
            })

        page = self.paginate_queryset(list(comment_group.items()))
        if page is not None:
            data = dict(page)
            return self.get_paginated_response(data)
        
        return Response(comment_group)
    

class CreateReservationCommentView(CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PropertyCommentSerializer
    lookup_field = 'pk'

    def post(self, request, pk):
        # create a comment for a reservation
        if not Reservation.objects.filter(id=pk).exists():
            return Response(status=404)
        
        client = Reservation.objects.get(id=pk).client
        host = Reservation.objects.get(id=pk).property.user
        if self.request.user != client and self.request.user != host:
            return Response("You are not authorized to comment on this reservation",status=403)
        
        if not Reservation.objects.get(id=pk).status == 'terminated':
            return Response("Reservation is not completed, you cannot comment yet", status=403)
        
        current_count = PropertyComment.objects.filter(reservation__id=pk).count()
        if self.request.user == client and current_count % 2 == 1:
            return Response("You need to wait for host to comment first", status=403)
        if self.request.user == host and current_count % 2 == 0:
            return Response("You need to wait for client to comment first", status=403)
        
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            comment_number = PropertyComment.objects.filter(reservation__id=pk).count() + 1
            reservation = Reservation.objects.get(id=pk)
            serializer.save(msg=request.data.get('msg'),
                            reservation=reservation.client,
                            comment_number=comment_number)
            if comment_number == 1:
                Notification(msg='Your property have a new comment from your tenant',
                is_host=True,
                user_from=reservation,
                user_to=self.request.user).save()
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.errors, status=400)
        
        
class UpdateUserToPropertyRatingView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ReservationUserToPropertyRatingSerializer
    lookup_field = 'pk'

    def put(self, request, pk):
        # update the user_to_property_rating for a reservation
        if not Reservation.objects.filter(id=pk).exists():
            return Response(status=404)
        
        client = Reservation.objects.get(id=pk).client

        if self.request.user != client:
            return Response("You are not authorized to rate this property",status=403)
        
        if not Reservation.objects.get(id=pk).status == 'terminated':
            return Response("Reservation is not completed, you cannot rate the property yet", status=403)
        
        rating = request.data.get('user_to_property_rating')
        if rating not in {'1', '2', '3', '4', '5'}:
            return Response("Rating must be an integer between 1 and 5", status=400)
        
        Reservation.objects.filter(id=pk).update(user_to_property_rating=rating)
        return Response("You have successfully rated this property", status=200)
    
    
class UpdateHostToUserRatingView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ReservationHostToUserRatingSerializer
    lookup_field = 'pk'

    def put(self, request, pk):
        # update the user_to_property_rating for a reservation
        if not Reservation.objects.filter(id=pk).exists():
            return Response(status=404)
        
        host = Reservation.objects.get(id=pk).property.user

        if self.request.user != host:
            return Response("You are not authorized to rate this tenant of the reservation",status=403)
        
        if not Reservation.objects.get(id=pk).status == 'terminated':
            return Response("Reservation is not completed, you cannot rate the tenant yet", status=403)
        
        rating = request.data.get('host_to_user_rating')
        if rating not in {'1', '2', '3', '4', '5'}:
            return Response("Rating must be an integer between 1 and 5", status=400)
        
        Reservation.objects.filter(id=pk).update(host_to_user_rating=rating)
        return Response("You have successfully rated this tenant", status=200)


class UpdateHostToUserMsgView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ReservationHostToUserMsgSerializer
    lookup_field = 'pk'

    def put(self, request, pk):
        # update the user_to_property_rating for a reservation
        if not Reservation.objects.filter(id=pk).exists():
            return Response(status=404)
        
        host = Reservation.objects.get(id=pk).property.user

        if self.request.user != host:
            return Response("You are not authorized to comment on this tenant of the reservation",status=403)
        
        if not Reservation.objects.get(id=pk).status == 'terminated':
            return Response("Reservation is not completed, you cannot comment on the tenant yet", status=403)
        
        msg = request.data.get('host_to_user_msg')
        if msg == '' or msg is None:
            return Response("Message cannot be empty", status=400)
        
        Reservation.objects.filter(id=pk).update(host_to_user_msg=msg)
        return Response("You have successfully commented on this tenant", status=200)
    

class UserCommentView(ListAPIView):
    permission_classes = [permissions.AllowAny]
    pagination_class = CommentsPagination
    serializer_class = UserCommentSerializer
    pagination_class.page_size = 1
    lookup_field = 'pk'

    def get_queryset(self):
        get_object_or_404(User, id=self.kwargs['pk'])
        return Reservation.objects.filter(client=self.kwargs['pk']).order_by('-end_date')