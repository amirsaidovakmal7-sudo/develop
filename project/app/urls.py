from django.urls import path, re_path

from . import views

urlpatterns = [
    path('order', views.order_project),
    # Everything else is a page (or the 404); admin and static keep their own handlers.
    re_path(r'^(?!admin(?:/|$)|static/).*$', views.page),
]
