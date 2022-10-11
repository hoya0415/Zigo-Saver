from django.urls import path
from . import views

urlpatterns = [
    path('album/add/', views.add_album),
    path('album/list/', views.album_list),
    path('album/<int:album_id>/', views.album_detail),
    path('album/search/<str:keyword>/', views.search_album),
    path('sales/', views.sales),
    path('item/delete/<int:item_pk>/', views.item_delete),
    path('buy/<int:item_id>/', views.buy_album),
]