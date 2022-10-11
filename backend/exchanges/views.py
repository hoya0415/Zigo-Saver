import secrets
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from accounts.models import History, Account, User
from accounts.serializers import RefundsHistorySerializer, AccountSerializer, UserSerializer, UserPointSerializer


@api_view(['POST'])
def refunds(request):
    if request.user.is_authenticated:
        price = int(request.data['price'])
        if request.user.point < price or price == 0:
            return Response({'message': '0 포인트 이상 보유 포인트이하 금액만 환급 가능합니다.'}, status=status.HTTP_400_BAD_REQUEST)

        bank = request.data['bank']
        account_num = request.data['account_num']
        holder = request.data['holder']

        user = get_object_or_404(get_user_model(), pk=request.user.pk)    
        after_point = user.point - price
        user.point = after_point
        user.save()

        key = secrets.token_hex(8)
        history = History.objects.create(user=request.user, types=2, trading_point=price, total_point=after_point, key=key)
        account = Account.objects.create(user=user, bank=bank, account_num=account_num, holder=holder)

        serializer = AccountSerializer(account)

        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def charge(request):
    if request.user.is_authenticated:
        user = get_object_or_404(get_user_model(), pk=request.user.pk)
        price = int(request.data['price'])
        after_point = user.point + price
        user.point = after_point
        user.save()
        serializer = UserPointSerializer(user)
        key = secrets.token_hex(8)

        history = History.objects.create(user=user, types=1, trading_point=price, total_point=after_point, key=key)

        return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(['POST'])
def charge_seed(request):
    if request.user.is_authenticated:
        seed_cnt = int(request.data['cnt'])
        exchange_point = seed_cnt*500

        if request.user.point < exchange_point:
            return Response({'message': '보유 포인트가 부족합니다.'}, status=status.HTTP_400_BAD_REQUEST)

        if seed_cnt == 0:
            return Response({'message': '교환 씨앗 개수는 1개이상 가능합니다.'}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(get_user_model(), pk=request.user.pk)
        after_point = user.point - exchange_point

        user.point = after_point
        user.user_seed += seed_cnt
        user.save()
        serializer = UserPointSerializer(user)
        key = secrets.token_hex(8)

        history = History.objects.create(user=user, types=5, trading_point=exchange_point, total_point=after_point, key=key)

        return Response(serializer.data, status.HTTP_200_OK) 
