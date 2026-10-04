from django.conf import settings
from django.http import HttpResponsePermanentRedirect

from . import seo


class CanonicalHostMiddleware:
    """www.akmal.dev → akmal.dev with a 301, so search engines see one host."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        host = request.get_host().split(':', 1)[0].lower()
        domain = seo.site_domain().lower()
        if not settings.DEBUG and host == f'www.{domain}':
            return HttpResponsePermanentRedirect(seo.origin() + request.get_full_path())
        return self.get_response(request)
