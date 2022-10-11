from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Alarm


class AlarmListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alarm
        fields = '__all__'