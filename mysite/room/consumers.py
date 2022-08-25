from email import message
import json

from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async

from django.contrib.auth.models import User

from .models import Message, Room

class ChatConsumer(AsyncWebsocketConsumer):

    __userlist = dict()
    __typing_userlist = dict()

    async def getTypingList(self):
        return self.__typing_userlist
    
    async def setTypingList(self, typing_list):
        self.__typing_userlist = typing_list

    async def getUserList(self):
        return self.__userlist

    async def setUserList(self, user_list):
        self.__userlist = user_list

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self,close_code):
        self.__userlist[self.room_name].clear()
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        await self.channel_layer.group_send(
            self.room_group_name,
            {
            'type': 'take_usernames',
            'build_user_in_room_list': True,
            }
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        username = data['username']
        room = data['room']
        if 'inRoom' in data:
            user_list = await self.getUserList()
            if data['inRoom']:
                if(room not in user_list):
                    user_list[room] = set()
                user_list[room].add(username)
                self.setUserList(user_list)
            else:
                user_list[room].remove(username)
                self.setUserList(user_list)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'actual_user_list',
                    'user_list':user_list[room],
                }
            )
        elif 'message' in data:
            message = data['message']
            role = data['super_user']

            await self.save_message(username,room,message)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message':message,
                    'username':username,
                    'room':room,
                    'super_user': role,
                }
        )
        elif 'typing' in data:
            typing = data['typing']
            typing_list = await self.getTypingList()
            if(room not in typing_list):
                    typing_list[room] = set()
            if(typing):
                typing_list[room].add(username)
            else:
                print(typing_list[room])
                typing_list[room].remove(username)
                print(f"User {username} stopped Typing!")
            await self.setTypingList(typing_list)
            print(await self.getTypingList())
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'actual_typing_list',
                    'typing_list':typing_list[room],
                }
            )
        else:
            print("~~~~~~~~~~~~~~~~~~~~~~~~~~~\nNOT HANDLED RECEIVE METHOD\nPLEASE WRITE ONE! :)\n~~~~~~~~~~~~~~~~~~~~~~~~~~~")

    async def take_usernames(self, event):
        boolean = event['build_user_in_room_list']

        await self.send(text_data=json.dumps({
            'build_user_in_room_list': boolean,
        }))

    async def chat_message(self, event):
        message = event['message']
        username = event['username']
        room = event['room']
        role = event['super_user']

        await self.send(text_data=json.dumps({
            'message': message,
            'username': username,
            'room': room,
            'super_user': role
        }))
    
    async def actual_user_list(self,event):
        user_list = ",".join(event['user_list'])

        await self.send(text_data=json.dumps({
            'user_list': user_list,
        }))

    async def actual_typing_list(self,event):
        typing_list = ",".join(event['typing_list'])

        await self.send(text_data=json.dumps({
            'typing_list': typing_list,
        }))

    @sync_to_async
    def save_message(self, username, room, message):
        user = User.objects.get(username=username)
        room = Room.objects.get(slug=room)

        Message.objects.create(user=user, room=room, content=message)