from django.db import models
from django.conf import settings

# Create your models here.
class Album(models.Model):
    album_img = models.CharField(max_length=200)
    album_name = models.CharField(max_length=80)
    singer = models.CharField(max_length=20)
    release = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.pk}: {self.singer}"

class Item(models.Model):
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    album = models.ForeignKey(Album, on_delete=models.CASCADE)
    price = models.IntegerField()
    opened = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)
    detail = models.CharField(max_length=100)
    cnt = models.IntegerField()

    def __str__(self):
        return f"{self.seller}: {self.album}"
    