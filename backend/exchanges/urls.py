from django.urls import path
from . import views

urlpatterns = [
    path('refunds/', views.refunds),
    path('charge/', views.charge),
    path('charge/seed/', views.charge_seed),
]