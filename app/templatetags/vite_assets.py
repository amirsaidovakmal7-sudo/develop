"""
Reads frontend/dist/.vite/manifest.json (produced by `npm run build`, see
frontend/vite.config.ts `build.manifest: true`) and renders the correct
hashed <script>/<link>/<preload> tags for the React entry point.

This is the only piece of glue between Django and the built React app —
views.py, urls.py and the /order flow are untouched.
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

# The two faces that carry the first screen's largest type. They are
# self-hosted (frontend/scripts/gen-fonts.mjs), so preloading them removes
# the reflow that used to happen when the display font finally arrived.
# Both scripts are listed because the language switch is client-side.
PRELOAD_FONTS = (
    'src/assets/fonts/unbounded-400-cyrillic.woff2',
    'src/assets/fonts/unbounded-400-latin.woff2',
    'src/assets/fonts/onest-400-cyrillic.woff2',
    'src/assets/fonts/onest-400-latin.woff2',
)

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
    font_links = format_html_join(
        '\n',
        '<link rel="preload" as="font" type="font/woff2" href="{}" crossorigin>',
        (
            (static(manifest[key]['file']),)
            for key in PRELOAD_FONTS
            if key in manifest and 'file' in manifest[key]
        ),
    )
    css_links = format_html_join(
        '\n',
        '<link rel="stylesheet" href="{}">',
        ((static(css_file),) for css_file in entry.get('css', [])),
    )
    script_tag = format_html('<script type="module" src="{}"></script>', static(entry['file']))
    return mark_safe(f'{font_links}\n{css_links}\n{script_tag}')
