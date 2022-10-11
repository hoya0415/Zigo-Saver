from django.db import models
from django.conf import settings

# Create your models here.
class Forest(models.Model):
    singer = models.CharField(max_length=10)
    total_seed = models.IntegerField(default=0)
    total_tree = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.pk}: {self.singer}"

class Seed(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    forest = models.ForeignKey(Forest, on_delete=models.CASCADE)
    cnt = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user}: {self.forest}"