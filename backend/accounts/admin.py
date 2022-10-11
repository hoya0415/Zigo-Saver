from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, History, Account

# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(History)
admin.site.register(Account)