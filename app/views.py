import os

from django.http import JsonResponse
from django.shortcuts import render, redirect
import telebot

bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
group_id = os.environ.get('TELEGRAM_GROUP_ID')
bot = telebot.TeleBot(bot_token) if bot_token else None


def home_page(request):
    return render(request, 'index.html')


def order_project(request):
    if request.method != 'POST':
        return redirect('/')

    is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
    name = (request.POST.get('name') or '').strip()
    phone = (request.POST.get('phone_number') or '').strip()

    if not name or not phone:
        if is_ajax:
            return JsonResponse({'ok': False, 'error': 'missing_fields'}, status=400)
        return redirect('/')

    if bot is not None and group_id:
        text = (
            f'Новый заказ \n\n'
            f'Имя клиента: {name} \n'
            f'Номер телефона: {phone}\n'
        )
        try:
            bot.send_message(group_id, text)
        except Exception:
            if is_ajax:
                return JsonResponse({'ok': False, 'error': 'telegram_failed'}, status=502)
            return redirect('/')

    if is_ajax:
        return JsonResponse({'ok': True})
    return redirect('/')
