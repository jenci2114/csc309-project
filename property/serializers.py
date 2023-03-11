from rest_framework import serializers

from property.models import *


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['image', 'property']
        read_only_fields = ['property']


class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = ['id', 'user', 'address', 'city', 'province', 'zip',
                  'beds', 'bathrooms', 'max_guests', 'description']
        read_only_fields = ['user']


class PropertyCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyComment
        fields = ['msg']

class ReservationUserToPropertyRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['user_to_property_rating']
        # fields is required
        extra_kwargs = {'user_to_property_rating': {'required': True}}

class ReservationHostToUserRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['host_to_user_rating']
        # fields is required
        extra_kwargs = {'host_to_user_rating': {'required': True}}


class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyAvailability
        fields = ['id', 'start_date', 'end_date', 'price_per_night', 'property']
        read_only_fields = ['property']
