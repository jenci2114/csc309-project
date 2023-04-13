from abc import ABC

from rest_framework import serializers

from property.models import *


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['id', 'image', 'property']
        read_only_fields = ['property']


class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = '__all__'
        read_only_fields = ['user']


class ReservationSerializer(serializers.ModelSerializer):
    user_type = serializers.CharField(required=True, write_only=True)
    state = serializers.CharField(required=True, write_only=True)
    class Meta:
        model = Reservation
        fields = ['user_type', 'state']
        extra_kwargs = {'user_type': {'required': True},
                        'state': {'required': True}}


class FullReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = '__all__'



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


class ReservationHostToUserMsgSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['host_to_user_msg']
        # fields is required
        extra_kwargs = {'host_to_user_msg': {'required': True}}


class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyAvailability
        fields = ['id', 'start_date', 'end_date', 'price_per_night', 'property']
        read_only_fields = ['property']

class UserCommentSerializer(serializers.ModelSerializer):
    host = serializers.ReadOnlyField(source='property.user.username')
    property = serializers.ReadOnlyField(source='property.id')
    class Meta:
        model = Reservation
        fields = ['host', 'property', 'start_date', 'end_date', 'host_to_user_rating', 'host_to_user_msg']


class DatePriceSerializer(serializers.Serializer):
    date = serializers.DateField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2)

    def create(self, validated_data):
        return {'date': validated_data['date'], 'price': validated_data['price']}

    def update(self, instance, validated_data):
        instance['date'] = validated_data.get('date', instance['date'])
        instance['price'] = validated_data.get('price', instance['price'])
        return instance
