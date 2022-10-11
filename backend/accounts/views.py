import socketio
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from stores.models import Album, Item
from .serializers import UserListSerializer, UserSerializer, HistorySerializer, PointHistoryListSerializer, ItemSerializer, HistoryListSerializer, SeedSerializer
from django.contrib.auth import get_user_model, logout as auth_logout
from .models import History
from headers.models import Alarm
from stores.models import Item

sio = socketio.Client()
sio.connect('http://k6d202.p.ssafy.io:9999/')

# Create your views here.
@api_view(['POST'])
def signup(request):
    if request.data.get('password') != request.data.get('password2'):
        return Response({ 'error': '비밀번호 확인해주세요.' }, status.HTTP_400_BAD_REQUEST)

    serializer = UserListSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        user = serializer.save()
        user.set_password(request.data.get('password'))
        user.save()
        return Response(serializer.data, status.HTTP_201_CREATED)


@api_view(['DELETE'])
def user_delete(request):
    if request.user.is_authenticated:
        request.user.delete()
        auth_logout(request)
        return Response({ 'message': '성공적으로 탈퇴하였습니다.' }, status.HTTP_200_OK)


@api_view(['GET'])
def info(request):
    if request.user.is_authenticated:
        user = get_object_or_404(get_user_model(), pk=request.user.pk)
        serializer = UserSerializer(user)
        return Response(serializer.data, status.HTTP_200_OK)


@api_view(['PUT'])
def address_create(request):
    if request.user.is_authenticated:
        user = get_object_or_404(get_user_model(), pk=request.user.pk)
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return Response(serializer.data, status.HTTP_200_OK)


@api_view(['GET'])
def point_history(request):
    if request.user.is_authenticated:
        user = get_object_or_404(get_user_model(), pk=request.user.pk)
        history = user.history_set.all()
        serializer = PointHistoryListSerializer(history, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    

@api_view(['GET'])
def history_detail(request, history_pk):
    if request.user.is_authenticated:
        user_history = get_object_or_404(History, pk=history_pk)
        other_history = History.objects.filter(key=user_history.key) & History.objects.exclude(pk=history_pk)
        serializer = HistorySerializer(user_history)
        return Response({'history': serializer.data, 'other_user': other_history[0].user.nickname})


@api_view(['PUT'])
def delivery(request, history_pk):
    if request.user.is_authenticated:
        seller_history = get_object_or_404(History, pk=history_pk)
        seller_history.delivery, seller_history.delivery_num = request.data.get('delivery'), request.data.get('delivery_num')
        seller_history.save()
        buyer_history = get_object_or_404(History, key=seller_history.key, types=3)
        buyer_history.delivery, buyer_history.delivery_num = request.data.get('delivery'), request.data.get('delivery_num')
        buyer_history.save()
        
        seller_serializer = HistorySerializer(seller_history)
        
        alarm_history = Alarm.objects.create(receiver=buyer_history.user, sender=seller_history.user.nickname, is_confirm=False, content='운송장 입력')
        sio.emit('alarm', {'isAlarm': True, 'receiver': buyer_history.user.username})

        return Response(seller_serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def confirmed(request, history_pk):
    if request.user.is_authenticated:
        history = get_object_or_404(History, pk=history_pk)
        history.is_confirm = True
        history.save()

        user = get_object_or_404(get_user_model(), pk=request.user.pk)
        user.user_seed += 1
        user.save()

        seller_history = get_object_or_404(History, key=history.key, types=4)
        seller_history.is_confirm = True
        seller_history.save()

        seller = get_object_or_404(get_user_model(), pk=seller_history.user.pk)
        seller.user_seed += 1
        seller.save()

        serializer = HistorySerializer(history)

        # 구매자에게 알림
        alarm_history1 = Alarm.objects.create(receiver=user, sender=seller.nickname, is_confirm=False, content='구매 확정')
        sio.emit('alarm', {'isAlarm': True, 'receiver': user.username})
        # 판매자에게 알림
        alarm_history2 = Alarm.objects.create(receiver=seller, sender=user.nickname, is_confirm=False, content='구매 확정')
        sio.emit('alarm', {'isAlarm': True, 'receiver': seller.username})

        return Response(serializer.data) 


@api_view(['GET'])
def sales_history(request, type_pk):
    if int(type_pk) == 1:  # 판매 전
        items_list = History.objects.filter(user=request.user.pk, is_confirm=True, types=4).values_list('item', flat=True)
        print(items_list)
        items = Item.objects.filter(seller=request.user.pk) & Item.objects.exclude(pk__in=items_list)
        serializer = ItemSerializer(items, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    elif int(type_pk) == 2:  # 판매 완료
        items_list = History.objects.filter(user=request.user.pk, is_confirm=True, types=4).values_list('item', flat=True)
        items = Item.objects.filter(pk__in=items_list, seller=request.user.pk, cnt=0)
        serializer = ItemSerializer(items, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    return Response({'message': 'type parameter를 확인해주세요.'}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
def buy_history(request, type_pk):
    if request.user.is_authenticated:
        if int(type_pk) == 1:
            history = History.objects.filter(user=request.user, is_confirm=False, types=3)
            serializer = HistorySerializer(history, many=True)
            return Response(serializer.data)

        elif int(type_pk) == 2:
            history = History.objects.filter(user=request.user, is_confirm=True, types=3)
            serializer = HistorySerializer(history, many=True)
            return Response(serializer.data)

    return Response({'detail':'권한이 없습니다.'}, status=status.HTTP_403_FORBIDDEN)


@api_view(['GET'])
def buy_detail(request, item_pk):
    if request.user.is_authenticated:
        item = get_object_or_404(Item, seller_id=request.user.pk, pk=item_pk)
        type4_history = History.objects.filter(item=item, types=4) 
        type3_history = History.objects.filter(item=item, types=3)

        data = {
            'item': ItemSerializer(item).data,
            'type3_history' : HistoryListSerializer(type3_history, many=True).data,
            'type4_history' : HistoryListSerializer(type4_history, many=True).data
        }

        return Response(data, status=status.HTTP_200_OK)
    return Response({'detail':'권한이 없습니다.'}, status=status.HTTP_403_FORBIDDEN)


@api_view(['GET'])
def seed_history(request):
    if request.user.is_authenticated:
        user = get_object_or_404(get_user_model(), pk=request.user.pk)
        forest = user.seed_set.all()
        total = 0
        for seed in forest:
            total += seed.cnt

        serializer = SeedSerializer(forest, many=True)

        return Response({'total': total ,'seed_list': serializer.data})
