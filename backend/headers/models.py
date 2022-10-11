from django.db import models
from django.conf import settings

# Create your models here.

class Alarm(models.Model):
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    sender = models.CharField(max_length=50)
    is_confirm = models.BooleanField()
    content = models.CharField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.pk}: {self.user}"







