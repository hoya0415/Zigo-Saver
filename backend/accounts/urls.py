from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from . import views

urlpatterns = [
    path('signup/', views.signup),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('info/', views.info),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('delete/', views.user_delete),
    path('address/create/', views.address_create),
    path('history/detail/<int:history_pk>/', views.history_detail),
    path('delivery/<int:history_pk>/', views.delivery),
    path('confirmed/<int:history_pk>/', views.confirmed),
    path('history/point/', views.point_history),
    path('history/sales/<int:type_pk>/', views.sales_history),
    path('history/buy/<int:type_pk>/', views.buy_history),
    path('detail/sales/<int:item_pk>/', views.buy_detail),
    path('history/seed/', views.seed_history),
]