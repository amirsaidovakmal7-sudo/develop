from django.urls import path

from . import views

urlpatterns = [
    path('',views.home_page),
    path('order', views.order_project),


]
