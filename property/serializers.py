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
