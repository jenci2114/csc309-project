from rest_framework import serializers

from property.models import *


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['image']


class PropertySerializer(serializers.ModelSerializer):
    # images = PropertyImageSerializer(many=True, required=False)
    class Meta:
        model = Property
        fields = ['id', 'user', 'address', 'city', 'province', 'zip',
                  'beds', 'bathrooms', 'max_guests', 'description']
        read_only_fields = ['user']


class PropertyCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyComment
        fields = ['msg']


class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyAvailability
        fields = ['id', 'start_date', 'end_date', 'price_per_night', 'property']
        read_only_fields = ['property']

    