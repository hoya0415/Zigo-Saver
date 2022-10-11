from django.urls import path
from . import views

urlpatterns = [
    path('<int:forest_pk>/', views.forest_list_create),
    path('<int:forest_pk>/rank/', views.forest_rank),
    path('', views.forest_list),
]