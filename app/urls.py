from django.urls import path, re_path

from . import views

urlpatterns = [
    path('', views.home_page),
    re_path(r'^(about|services|projects|contacts)/?$', views.home_page),
    path('order', views.order_project),
]
