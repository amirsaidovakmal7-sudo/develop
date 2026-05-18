import token

from django.shortcuts import render, redirect
import telebot


bot = telebot.TeleBot('8320858900:AAFd1n0xNi3W5evCxbiGgJ_9a1ghvcRTSIo')
group_id = -1003736427017


# Create your views here.



def home_page(request):
    return render(request,'index.html')



def order_project(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        phone = request.POST.get('phone_number')
        text = (f'Новый заказ \n\n'
                f'Имя клиента: {name} \n'
                f'Номер телефона: {phone}\n')
        bot.send_message(group_id, text)
    return redirect('/')
