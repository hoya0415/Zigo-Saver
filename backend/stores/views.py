import socketio
import secrets
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404, get_list_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from accounts.models import History
from headers.models import Alarm
from .models import Album, Item
from .serializers import AlbumSerializer, ItemSerializer

sio = socketio.Client()
sio.connect('http://k6d202.p.ssafy.io:9999/')

@api_view(['POST'])
def add_album(request):
    if request.user.is_authenticated and request.user.is_superuser:
        img = request.data['img']
        title = request.data['title']
        singer = request.data['singer']
        release = request.data['release']
        album = Album.objects.create(album_img=img, album_name=title, singer=singer, release=release)

        serializer = AlbumSerializer(album)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif not request.user.is_superuser:
        return Response({'message': '앨범 등록 권한이 없습니다.'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
def album_list(request):
    if request.user.is_authenticated:
        albums = Album.objects.all()
        serializer = AlbumSerializer(albums, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def album_detail(request, album_id):
    album = get_object_or_404(Album, pk=album_id)
    album_serializer = AlbumSerializer(album)

    items = album.item_set.all()
    serializer = ItemSerializer(items, many=True)
    
    data = {
        'id' : album_serializer.data['id'],
        'album_img' : album_serializer.data['album_img'],
        'album_name' : album_serializer.data['album_name'],
        'singer' : album_serializer.data['singer'],
        'release' : album_serializer.data['release'],
        'item' : serializer.data
    }
    return Response(data, status=status.HTTP_200_OK)


@api_view(['GET'])
def search_album(request, keyword):
    albums = Album.objects.filter(album_name__icontains=keyword) | Album.objects.filter(singer__icontains=keyword)
    serializer = AlbumSerializer(albums, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def sales(request):
    if request.user.is_authenticated:
        album_id = int(request.data['album_id'])
        album = get_object_or_404(Album, pk=album_id)
        opened = request.data['is_opened']
        price = int(request.data['price'])
        cnt = int(request.data['cnt'])
        detail = request.data['detail']

        item = Item.objects.create(seller=request.user, album=album, price=price, opened=opened, cnt=cnt, detail=detail)
        items = get_list_or_404(Item, album=album)
        serializer = ItemSerializer(items, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def buy_album(request, item_id):
    if request.user.is_authenticated:
        item = get_object_or_404(Item, pk=item_id)
        if request.user.point < item.price:
            return Response({'message': '보유 포인트가 부족합니다.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if item.cnt == 0:
            return Response({'message': '판매 가능한 수량이 없습니다.'}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(get_user_model(), pk=request.user.pk)
        user.point -= (item.price + 3000)
        user.save()

        seller = item.seller
        seller.point += (item.price + 2000)
        seller.save()

        item.cnt -= 1
        item.save()

        key = secrets.token_hex(8)

        user_history = History.objects.create(user=user, album=item.album, item=item, types=3, trading_point=item.price, total_point=user.point, cnt=1, key=key)
        seller_history = History.objects.create(user=seller, album=item.album, item=item, types=4, trading_point=item.price, total_point=seller.point, cnt=1, key=key)
        alarm_history = Alarm.objects.create(receiver=seller, sender=user.nickname, is_confirm=False, content='앨범 구매')

        sio.emit('alarm', {'isAlarm': True, 'receiver': seller.username})

        return Response({'message':'성공적으로 구매되었습니다.'}, status=status.HTTP_200_OK)


@api_view(['DELETE'])
def item_delete(request, item_pk):
    if request.user.is_authenticated:
        item = get_object_or_404(Item, seller_id=request.user.pk, pk=item_pk)
        if not item.history_set.exists():
            item.delete()
            return Response({'message': '성공적으로 삭제되었습니다.'}, status=status.HTTP_200_OK)
        
        return Response({'message': '판매 내역이 존재합니다.'}, status.status.HTTP_400_BAD_REQUEST)