from rest_framework import serializers
from .models import Forest, Seed
from accounts.serializers import UserListSerializer

class ForestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Forest
        fields = '__all__'


class RankListSerializer(serializers.ModelSerializer):
    user = UserListSerializer(read_only=True)
    class Meta:
        model = Seed
        fields = ('id', 'user','forest', 'cnt',)