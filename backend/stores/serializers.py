from rest_framework import serializers
from .models import Album, Item
from accounts.serializers import UserListSerializer

class AlbumSerializer(serializers.ModelSerializer):
  class Meta:
    model = Album
    fields = '__all__'


class ItemSerializer(serializers.ModelSerializer):
  seller = UserListSerializer(read_only=True)
  class Meta:
    model = Item
    fields = '__all__' 

