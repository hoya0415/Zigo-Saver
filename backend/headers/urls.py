from django.urls import path
from . import views

urlpatterns = [
    path('alarm/', views.alarm_list),
    path('alarm/check/', views.alarm_check),
]