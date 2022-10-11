import socketio
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Forest, Seed
from .serializers import ForestSerializer, RankListSerializer
from accounts.serializers import UserPointSerializer

sio = socketio.Client()
sio.connect('http://k6d202.p.ssafy.io:9999/')

@api_view(['GET','POST'])
def forest_list_create(request, forest_pk):
    if request.method == 'GET':
        forest = get_object_or_404(Forest, pk=forest_pk)
        serializer = ForestSerializer(forest)
        return Response(serializer.data)

    if request.method == 'POST':
        if request.user.is_authenticated:
            user = get_object_or_404(get_user_model(), pk=request.user.pk)
            seed_cnt = int(request.data['seed_cnt'])
            if user.user_seed - seed_cnt >= 0:
                user.user_seed -= seed_cnt
                user.save() 
            
                if request.user.seed_set.filter(forest=forest_pk).exists():
                    seed = request.user.seed_set.get(forest=forest_pk)
                    seed.cnt += seed_cnt
                    seed.save()
                else:
                    request.user.seed_set.create(cnt=seed_cnt, forest_id=forest_pk)

                forest = get_object_or_404(Forest, pk=forest_pk)
                forest.total_seed += seed_cnt
                current_tree = forest.total_tree
                forest.total_tree = forest.total_seed // 25
                forest.save()

                if current_tree < forest.total_tree:
                    new_tree = forest.total_tree - current_tree
                    print(new_tree)
                    sio.emit('new_tree', {'forest': forest.singer, 'tree_cnt': new_tree})



                serializer = ForestSerializer(forest)
                data = {
                    'user': UserPointSerializer(user).data,
                    'forest': serializer.data
                }
                return Response(data, status.HTTP_201_CREATED)

            return Response({'detail':'씨앗이 부족합니다.'})
        return Response({'detail':'권한이 없습니다.'}, status=status.HTTP_403_FORBIDDEN)

         
@api_view(['GET'])
def forest_rank(request, forest_pk):
    rank = Seed.objects.filter(forest_id=forest_pk).order_by('-cnt')
    serializer = RankListSerializer(rank, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def forest_list(request):
    forest = Forest.objects.all()
    serializer = ForestSerializer(forest, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)