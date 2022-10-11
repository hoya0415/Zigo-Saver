from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import History, Account
from stores.models import Item, Album
from forest.models import Seed, Forest

class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'nickname', 'character']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'nickname', 'character', 'point', 'user_seed', 'name', 'phonenum', 'address', 'message', 'level']
        read_only_fields = ('username',)


class UserPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'point', 'user_seed',]


class RefundsHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = History
        fields = ['type', 'date', 'trading_point', 'total_point',]


class AccountSerializer(serializers.ModelSerializer):
    user = UserPointSerializer(read_only=True)
    class Meta:
        model = Account
        fields = '__all__'


class AlbumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Album
        fields = '__all__'


class ItemSerializer(serializers.ModelSerializer):
    album = AlbumSerializer(read_only=True)
    class Meta:
        model = Item
        fields = '__all__'


class PointHistoryListSerializer(serializers.ModelSerializer):
    album = AlbumSerializer(read_only=True)
    class Meta:
        model = History
        fields = ['id', 'created_at', 'types', 'trading_point', 'total_point', 'album',]


class HistorySerializer(serializers.ModelSerializer):
    album = AlbumSerializer(read_only=True)
    item = ItemSerializer(read_only=True)
    class Meta:
        model = History
        fields = '__all__'
        read_only_fields = ('types','trading_point','total_point','user','item',)
        

class HistoryListSerializer(serializers.ModelSerializer):
    user = UserListSerializer(read_only=True)
    class Meta:
        model = History
        fields = '__all__'


class ForestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Forest
        fields = '__all__'


class SeedSerializer(serializers.ModelSerializer):
    forest = ForestSerializer(read_only=True)
    class Meta:
        model = Seed
        fields = '__all__'