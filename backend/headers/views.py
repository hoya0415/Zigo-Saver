from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404, get_list_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Alarm
from .serializers import AlarmListSerializer

# Create your views here.
@api_view(['GET'])
def alarm_list(request):
	if request.user.is_authenticated:
		alarms = Alarm.objects.filter(receiver=request.user).order_by('-created_at')
		serializer = AlarmListSerializer(alarms, many=True)

		for alarm in alarms:
			alarm.is_confirm = True
			alarm.save()

		return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def alarm_check(request):
	if request.user.is_authenticated:
		alarms = Alarm.objects.filter(receiver=request.user, is_confirm=False)
		if alarms:
			isRead = False
		else: isRead = True

		return Response({'isRead': isRead})
