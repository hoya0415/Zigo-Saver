from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from stores.models import Item, Album
# Create your models here.

class User(AbstractUser):
    nickname = models.CharField(max_length=10, blank=True)
    character = models.IntegerField(default=0)
    point = models.IntegerField(default=0)
    user_seed = models.IntegerField(default=0)
    name = models.CharField(max_length=10, blank=True)
    phonenum = models.CharField(max_length=11, blank=True)
    address = models.CharField(max_length=50, blank=True)
    message = models.CharField(max_length=100, blank=True)
    level = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.pk}: {self.username}"


class Account(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    bank = models.CharField(max_length=10)
    account_num = models.CharField(max_length=30)
    holder = models.CharField(max_length=5)

    def __str__(self):
        return f"{self.pk}: {self.user}"


class History(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    album = models.ForeignKey(Album, on_delete=models.CASCADE, null=True, blank=True)
    item = models.ForeignKey(Item, on_delete=models.CASCADE, null=True, blank=True)
    types = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    trading_point = models.IntegerField()
    total_point = models.IntegerField()
    cnt = models.IntegerField(null=True, blank=True)
    delivery = models.CharField(max_length=10, blank=True)
    delivery_num = models.CharField(max_length=20, blank=True)
    is_confirm = models.BooleanField(default=False)
    key = models.CharField(max_length=40)
    
    def __str__(self):
        return f"{self.pk}: {self.user}"