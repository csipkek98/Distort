from django.urls import path

from . import views

urlpatterns = [
    path('', views.profile, name='profiles'),
    path('<str:name>/', views.profile, name='profile'),
]