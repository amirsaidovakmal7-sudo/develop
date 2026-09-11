"""
Reads frontend/dist/.vite/manifest.json (produced by `npm run build`, see
frontend/vite.config.ts `build.manifest: true`) and renders the correct
hashed <script>/<link> tags for the React entry point.

This is the only piece of glue between Django and the built React app —
views.py, urls.py and the /order flow are untouched (TECH_TASK_REDISIGN.md п.62).
"""
import json
from pathlib import Path

from django import template
from django.conf import settings
from django.templatetags.static import static
from django.utils.html import format_html, format_html_join
from django.utils.safestring import mark_safe

register = template.Library()

MANIFEST_PATH = Path(settings.BASE_DIR) / 'frontend' / 'dist' / '.vite' / 'manifest.json'
ENTRY_KEY = 'index.html'

_cached_manifest = None


def _load_manifest():
    global _cached_manifest
    if not MANIFEST_PATH.exists():
        return None
    if settings.DEBUG:
        # Re-read on every request in dev so `npm run build` is picked up
        # without restarting `manage.py runserver`.
        with MANIFEST_PATH.open('r', encoding='utf-8') as fh:
            return json.load(fh)
    if _cached_manifest is None:
        with MANIFEST_PATH.open('r', encoding='utf-8') as fh:
            _cached_manifest = json.load(fh)
    return _cached_manifest


@register.simple_tag
def vite_asset_tags():
    manifest = _load_manifest()
    if not manifest or ENTRY_KEY not in manifest:
        # No build yet (e.g. fresh checkout before `npm run build`). Render
        # nothing rather than a 500 so `manage.py runserver` still boots.
        return mark_safe(
            '<!-- frontend/dist/.vite/manifest.json not found — run `npm run build` in frontend/ -->'
        )

    entry = manifest[ENTRY_KEY]
    css_links = format_html_join(
        '\n',
        '<link rel="stylesheet" href="{}">',
        ((static(css_file),) for css_file in entry.get('css', [])),
    )
    script_tag = format_html('<script type="module" src="{}"></script>', static(entry['file']))
    return mark_safe(f'{css_links}\n{script_tag}')
