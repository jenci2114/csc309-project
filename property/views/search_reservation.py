from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework import status
from ..models import Reservation
from django import forms
from backend.constants import *


class SearchForm(forms.Form):
    user_type = forms.CharField(max_length=20)
    state = forms.CharField(max_length=20)

    def clean(self):
        user_type = self.cleaned_data['user_type']
        state = self.cleaned_data['state']
        if user_type not in ['host', 'guest']:
            raise forms.ValidationError("User type must be 'host' or 'guest'")
        if state not in [PENDING, APPROVED, CANCELING, CANCELED, TERMINATED, DENIED, ALL]:
            raise forms.ValidationError("invalid state")
        return self.cleaned_data


class SearchView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = self.request.user
        form = SearchForm(request.data)

        if form.is_valid():
            user_type = form.cleaned_data['user_type']
            state = form.cleaned_data['state']

            if user_type == 'guest':
                query_set = Reservation.objects.filter(client=user)
            else:
                query_set = Reservation.objects.filter(property__user=user)
            if state != 'all':
                query_set = query_set.filter(status=state)

            query_set = [{'id': r.id,
                          'status': r.status,
                          'guest': r.client.username,
                          'host': r.property.user.username,
                          'property': r.property.id,
                          'start_date': r.start_date,
                          'end_date': r.end_date,
                          'total_price': r.total_price,
                          'host_to_user_msg': r.host_to_user_msg,
                          'host_to_user_rating': r.host_to_user_rating,
                          'user_to_property_rating': r.user_to_property_rating,
                          'number_of_property_comment': r.number_of_property_comment} for r in query_set]

            # Instantiate PageNumberPagination
            paginator = PageNumberPagination()
            paginated_data = paginator.paginate_queryset(query_set, request)

            return paginator.get_paginated_response(paginated_data)

        else:
            return Response({'errors': form.errors}, status=status.HTTP_400_BAD_REQUEST)

