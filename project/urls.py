"""
URL configuration for project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.contrib.sitemaps.views import sitemap
from django.templatetags.static import static
from django.urls import path, include
from django.views.generic import RedirectView

from app.sitemaps import PageSitemap
from app.views import robots_txt

urlpatterns = [
    path('admin/', admin.site.urls),
    path('robots.txt', robots_txt),
    path('sitemap.xml', sitemap, {'sitemaps': {'pages': PageSitemap}}, name='django.contrib.sitemaps.views.sitemap'),
    # Browsers and some crawlers ask for /favicon.ico regardless of the <link rel="icon">.
    path('favicon.ico', RedirectView.as_view(url=static('favicon.ico'), permanent=True)),
    path('', include('app.urls')),
]

handler404 = 'app.views.not_found'
