from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from .models import Message, Room

@login_required
def rooms(request):
    rooms = Room.objects.all()

    return render(request, 'room/rooms.html', {'rooms': rooms})

@login_required
def room(request, slug):
    room = Room.objects.get(slug=slug)
    messages_raw = Message.objects.filter(room=room)
    messages_len = len(messages_raw)
    load_in_message_size = 25
    if(messages_len <= load_in_message_size):
        messages = messages_raw
    else:
        messages = messages_raw[(messages_len-load_in_message_size-1):(messages_len)]

    return render(request, 'room/room.html', {'room': room, 'messages': messages})