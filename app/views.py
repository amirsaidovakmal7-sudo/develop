import logging
import os
import time

from django.http import HttpResponse, HttpResponsePermanentRedirect, JsonResponse
from django.shortcuts import render, redirect
from django.views.decorators.http import require_GET
import telebot
from telebot.apihelper import ApiTelegramException

from . import seo

bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
group_id = os.environ.get('TELEGRAM_GROUP_ID')
bot = telebot.TeleBot(bot_token) if bot_token else None
logger = logging.getLogger(__name__)


def page(request):
    """Every site page in every language: one address per page, the <head> and markup rendered for it."""
    path = request.path
    if path != '/' and path.endswith('/'):
        # /about/ and /uz/ are the same pages as /about and /uz: one canonical address, the query kept.
        target = path.rstrip('/') or '/'
        query = request.META.get('QUERY_STRING')
        return HttpResponsePermanentRedirect(f'{target}?{query}' if query else target)
    match = seo.resolve(path)
    if match is None:
        return not_found(request)
    return render(request, 'index.html', seo.page_context(*match))


def not_found(request, exception=None):
    # The React router renders its own 404 page; the status code tells crawlers the URL does not exist.
    return render(request, 'index.html', seo.not_found_context(request.path), status=404)


@require_GET
def robots_txt(request):
    lines = [
        'User-agent: *',
        'Allow: /',
        'Disallow: /admin/',
        'Disallow: /order',
        f'Sitemap: {seo.origin()}/sitemap.xml',
    ]
    return HttpResponse('\n'.join(lines) + '\n', content_type='text/plain; charset=utf-8')


def send_to_group(text, attempts=3):
    """Network hiccups on the way to api.telegram.org are retried; errors Telegram itself returns are not."""
    for attempt in range(1, attempts + 1):
        try:
            bot.send_message(group_id, text, timeout=10)
            return True
        except ApiTelegramException:
            logger.exception('Telegram rejected the lead')
            return False
        except Exception:
            logger.exception('Telegram delivery failed (attempt %s/%s)', attempt, attempts)
            if attempt < attempts:
                time.sleep(attempt)
    return False


def order_project(request):
    if request.method != 'POST':
        return redirect('/')

    is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
    name = (request.POST.get('name') or '').strip()
    phone = (request.POST.get('phone_number') or '').strip()
    telegram = (request.POST.get('telegram') or '').strip()[:64]
    comment = (request.POST.get('comment') or '').strip()[:1000]

    if not name or not phone:
        if is_ajax:
            return JsonResponse({'ok': False, 'error': 'missing_fields'}, status=400)
        return redirect('/')

    if bot is None or not group_id:
        # Without credentials the lead would be silently dropped; tell the visitor so they can use Telegram instead.
        if is_ajax:
            return JsonResponse({'ok': False, 'error': 'telegram_not_configured'}, status=503)
        return redirect('/')

    text = (
        f'Новый заказ \n\n'
        f'Имя клиента: {name} \n'
        f'Номер телефона: {phone}\n'
    )
    if telegram:
        text += f'Telegram: {telegram}\n'
    if comment:
        text += f'\nКомментарий:\n{comment}\n'
    if not send_to_group(text):
        if is_ajax:
            return JsonResponse({'ok': False, 'error': 'telegram_failed'}, status=502)
        return redirect('/')

    if is_ajax:
        return JsonResponse({'ok': True})
    return redirect('/')
