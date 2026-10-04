from django.contrib.sitemaps import Sitemap
from django.utils import translation

from . import seo


class PageSitemap(Sitemap):
    """All pages × languages, each with its hreflang alternates and x-default (Russian, at the root).

    The domain comes from SITE_ORIGIN rather than the request's Host header, so the sitemap
    always lists production addresses. No <lastmod>: the build has no honest per-page date.
    """

    i18n = True
    languages = ['ru', 'uz', 'en']
    alternates = True
    x_default = True  # settings.LANGUAGE_CODE ('ru') lives at the root
    changefreq = 'monthly'

    def items(self):
        meta = seo.load_meta()
        return list(meta['languages'][meta['defaultLocale']]['pages']) if meta else []

    def location(self, page):
        # Django calls this inside translation.override(<item language>).
        meta = seo.load_meta()
        return meta['languages'][translation.get_language()]['pages'][page]['path']

    def priority(self, page):
        return {'home': 1.0, 'services': 0.9}.get(page, 0.8)

    def get_domain(self, site=None):
        return seo.site_domain()

    def get_protocol(self, protocol=None):
        return seo.origin().split('://', 1)[0]
