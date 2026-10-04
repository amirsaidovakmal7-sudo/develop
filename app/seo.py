"""
Server-side <head> for every page and language.

The words come from frontend/dist-seo/meta.json, which `npm run build` generates
from the i18n dictionaries (frontend/scripts/gen-seo.ts), and the page markup
for crawlers from frontend/dist-seo/prerender/<lang>/<page>.html
(frontend/scripts/prerender.mjs). Nothing here duplicates the site's copy.
"""
import json
from pathlib import Path
from urllib.parse import urlsplit

from django.conf import settings

# Server-only build output; kept out of frontend/dist so it is not published as static files.
BUILD = Path(settings.BASE_DIR) / 'frontend' / 'dist-seo'
META_PATH = BUILD / 'meta.json'
PRERENDER_DIR = BUILD / 'prerender'

_cache = {}


def _read(path):
    """File contents cached by mtime, so a fresh build is picked up without a restart."""
    try:
        mtime = path.stat().st_mtime
    except OSError:
        return None
    hit = _cache.get(path)
    if hit and hit[0] == mtime:
        return hit[1]
    text = path.read_text(encoding='utf-8')
    _cache[path] = (mtime, text)
    return text


def load_meta():
    text = _read(META_PATH)
    return json.loads(text) if text else None


def origin():
    return settings.SITE_ORIGIN.rstrip('/')


def site_domain():
    return urlsplit(origin()).netloc


def resolve(path, meta=None):
    """`/uz/services` → ('uz', 'services'); None when the address is not a page."""
    meta = meta or load_meta()
    if not meta:
        return None
    for lang, data in meta['languages'].items():
        for page, info in data['pages'].items():
            if info['path'] == path:
                return lang, page
    return None


def language_of(path, meta=None):
    """Language for a 404: taken from the prefix, so /uz/whatever answers in Uzbek."""
    meta = meta or load_meta()
    locales = meta['locales'] if meta else ['ru']
    first = path.strip('/').split('/', 1)[0]
    default = meta['defaultLocale'] if meta else 'ru'
    return first if first in locales and first != default else default


def page_paths(meta=None):
    """Every (lang, page, path) the sitemap lists."""
    meta = meta or load_meta()
    if not meta:
        return []
    return [
        (lang, page, info['path'])
        for lang, data in meta['languages'].items()
        for page, info in data['pages'].items()
    ]


def _json_ld(graph):
    # `<` is escaped so no text can close the surrounding <script> element.
    return json.dumps({'@context': 'https://schema.org', '@graph': graph}, ensure_ascii=False).replace('<', '\\u003c')


def _structured_data(meta, lang, page):
    o = origin()
    data = meta['languages'][lang]
    seo = data['seo']
    info = data['pages'][page]
    contacts = meta['contacts']
    home_url = o + data['pages']['home']['path']
    page_url = o + info['path']
    image = o + data['ogImage']
    business_id = f'{o}/#business'
    website_id = f'{o}/#website'

    business = {
        '@type': 'ProfessionalService',
        '@id': business_id,
        'name': seo['orgName'],
        'description': seo['orgDescription'],
        'url': home_url,
        'image': image,
        'telephone': contacts['phone']['href'].removeprefix('tel:'),
        'email': contacts['email']['href'].removeprefix('mailto:'),
        'address': {'@type': 'PostalAddress', 'addressLocality': seo['city'], 'addressCountry': 'UZ'},
        'areaServed': {'@type': 'Country', 'name': seo['country']},
        'founder': {'@type': 'Person', 'name': seo['person'], 'jobTitle': seo['jobTitle']},
        'sameAs': [contacts['telegram']['href'], contacts['instagram']['href']],
        'contactPoint': {
            '@type': 'ContactPoint',
            'contactType': 'customer service',
            'telephone': contacts['phone']['href'].removeprefix('tel:'),
            'email': contacts['email']['href'].removeprefix('mailto:'),
            'availableLanguage': ['ru', 'uz', 'en'],
        },
    }
    website = {
        '@type': 'WebSite',
        '@id': website_id,
        'url': home_url,
        'name': 'akmal.dev',
        'inLanguage': lang,
        'publisher': {'@id': business_id},
    }
    webpage_type = {'about': 'AboutPage', 'contacts': 'ContactPage', 'projects': 'CollectionPage'}.get(page, 'WebPage')
    webpage = {
        '@type': webpage_type,
        '@id': f'{page_url}#webpage',
        'url': page_url,
        'name': info['title'],
        'description': info['description'],
        'inLanguage': lang,
        'isPartOf': {'@id': website_id},
        'about': {'@id': business_id},
        'primaryImageOfPage': {'@type': 'ImageObject', 'url': image},
    }
    graph = [business, website, webpage]

    crumbs = info['breadcrumbs']
    if crumbs:
        graph.append({
            '@type': 'BreadcrumbList',
            '@id': f'{page_url}#breadcrumb',
            'itemListElement': [
                {'@type': 'ListItem', 'position': i + 1, 'name': c['name'], 'item': o + c['path']}
                for i, c in enumerate(crumbs)
            ],
        })
        webpage['breadcrumb'] = {'@id': f'{page_url}#breadcrumb'}

    area = [{'@type': 'City', 'name': seo['city']}, {'@type': 'Country', 'name': seo['country']}]
    if 'service' in info:
        graph.append({
            '@type': 'Service',
            '@id': f'{page_url}#service',
            'name': info['service']['name'],
            'serviceType': info['service']['name'],
            'description': info['service']['description'],
            'url': page_url,
            'provider': {'@id': business_id},
            'areaServed': area,
            'availableLanguage': ['ru', 'uz', 'en'],
        })
        webpage['mainEntity'] = {'@id': f'{page_url}#service'}
    elif page == 'services':
        graph.append({
            '@type': 'ItemList',
            '@id': f'{page_url}#services',
            'itemListElement': [
                {
                    '@type': 'ListItem',
                    'position': i + 1,
                    'item': {
                        '@type': 'Service',
                        'name': s['name'],
                        'description': s['description'],
                        'provider': {'@id': business_id},
                        'areaServed': area,
                        **({'url': o + data['pages'][s['page']]['path']} if s['page'] else {}),
                    },
                }
                for i, s in enumerate(data['services'])
            ],
        })
        webpage['mainEntity'] = {'@id': f'{page_url}#services'}
    elif page == 'projects':
        graph.append({
            '@type': 'ItemList',
            '@id': f'{page_url}#projects',
            'itemListElement': [
                {
                    '@type': 'ListItem',
                    'position': i + 1,
                    'item': {
                        '@type': 'CreativeWork',
                        'name': p['name'],
                        'description': p['description'],
                        'creator': {'@id': business_id},
                        **({'url': p['url']} if p['url'] else {}),
                    },
                }
                for i, p in enumerate(data['projects'])
            ],
        })
        webpage['mainEntity'] = {'@id': f'{page_url}#projects'}
    elif page == 'about':
        webpage['mainEntity'] = {'@id': business_id}
    return _json_ld(graph)


def _prerender(lang, page):
    return _read(PRERENDER_DIR / lang / f'{page}.html') or ''


def _common(meta, lang):
    data = meta['languages'][lang]
    return {
        'lang': lang,
        'origin': origin(),
        'og_locale': data['ogLocale'],
        'og_locale_alternates': data['ogLocaleAlternates'],
        'og_image': origin() + data['ogImage'],
        'og_image_width': meta['ogImage']['width'],
        'og_image_height': meta['ogImage']['height'],
        'og_image_alt': data['seo']['ogAlt'],
        'author': data['seo']['person'],
        'google_verification': settings.GOOGLE_SITE_VERIFICATION,
        'yandex_verification': settings.YANDEX_VERIFICATION,
    }


def page_context(lang, page):
    meta = load_meta()
    info = meta['languages'][lang]['pages'][page]
    url = origin() + info['path']
    return {
        'seo': {
            **_common(meta, lang),
            'title': info['title'],
            'description': info['description'],
            'robots': 'index, follow, max-image-preview:large',
            'canonical': url,
            'url': url,
            'alternates': [{'hreflang': a['hreflang'], 'href': origin() + a['path']} for a in info['alternates']],
            'json_ld': _structured_data(meta, lang, page),
        },
        'prerender': _prerender(lang, page),
    }


def not_found_context(path):
    meta = load_meta()
    if not meta:
        return {'seo': None, 'prerender': ''}
    lang = language_of(path, meta)
    nf = meta['languages'][lang]['notFound']
    return {
        'seo': {
            **_common(meta, lang),
            'title': nf['title'],
            'description': nf['description'],
            'robots': 'noindex, follow',
        },
        'prerender': _prerender(lang, 'notFound'),
    }
