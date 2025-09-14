import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from asgiref.sync import sync_to_async
from dothatlac.utils.notification import send_message_notification


class ChatConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.room_group_name = None
        self.room_name = None
        self.user = None
        self.other_user = None
        self.chat_room_obj = None

    # setup connection
    async def connect(self):
        self.user = self.scope['user'] # get curent_user

        # get the user who is messaging by id on query_string
        other_user_id = self.scope['url_route']['kwargs'].get('other_user_id')

        try:
            self.other_user = await self.get_user_by_id(other_user_id)
            if not self.other_user:
                await self.close()
                print(f"Other user with ID {other_user_id} not found.")
                return
        except ValueError:
            await self.close()
            print(f"Invalid other_user_id: {other_user_id}")
            return

        # create new or get ChatRoom if it exists
        self.chat_room_obj, created = await self.get_or_create_chat_room(user_a=self.user, user_b=self.other_user)
        # get room name for instance consumer
        self.room_name = self.chat_room_obj.room_name
        self.room_group_name = f'chat_{self.room_name}'

        # create room chat
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name # unique name of instance Consumer
        )

        await self.accept() # accept WebSocket connection
        print(f"WebSocket connected: {self.channel_name} (User: {self.user.username}) to room "
              f"{self.room_name} with {self.other_user.username}")

        # get old message history
        old_messages = await self.get_old_messages(self.chat_room_obj)
        for msg in old_messages:
            message_dict = await self.message_to_dict(msg)
            await self.send(text_data=json.dumps(message_dict)) # return to client

    # close connection
    async def disconnect(self, close_code):
        # remove channel from room_group_name
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        print(f"WebSocket disconnected: {self.channel_name} from room {self.room_name}")

    # channel layer handle data from client
    async def receive(self, text_data):
        text_data_json = json.loads(text_data) # convert JSON into Python dict
        # get content from client
        message_content = text_data_json['content']

        # current_user
        username = self.user.username if self.user and not self.user.is_anonymous else 'Anonymous'

        # save message into db
        await self.save_message(self.chat_room_obj, self.user, message_content)

        # send message to room_group_name, all consumer in room_group_name are received
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat.message',
                'content': message_content,
                'username': username,
                'chat_room_name': self.room_name,
                'timestamp': await self.get_current_time_iso() # get current time
            }
        )
        print(f"Received message: '{message_content}' from {username} in room {self.room_name}")

    # return message to client
    # event save data from group_send
    async def chat_message(self, event):
        content = event['content']
        username = event['username']
        chat_room_name = event['chat_room_name']
        timestamp = event.get('timestamp')

        # convert Python dict into JSON and return to client
        await self.send(text_data=json.dumps({
            'content': content,
            'username': username,
            'chat_room_name': chat_room_name,
            'timestamp': timestamp
        }))

        await sync_to_async(send_message_notification)(self.other_user)
        print(f"Sent message: '{content}' from {username} to client {self.channel_name}")


    ''' SYCHRONIZED FUNCTION '''
    @database_sync_to_async
    def get_user_by_id(self, user_id):
        User = get_user_model()
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None

    @database_sync_to_async
    def get_or_create_chat_room(self, user_a, user_b):
        from dothatlac.models import ChatRoom
        return ChatRoom.get_or_create_room(user_a, user_b)

    @database_sync_to_async
    def save_message(self, chat_room, user, content):
        from dothatlac.models import Message
        Message.objects.create(
            chat_room=chat_room,
            user=user,
            content=content
        )

    @database_sync_to_async
    def get_old_messages(self, chat_room):
        # Lấy 50 tin nhắn gần nhất
        recent_messages = chat_room.messages.order_by('-timestamp')[:50]
        return list(reversed(recent_messages))

    @database_sync_to_async
    def get_current_time_iso(self):
        from django.utils import timezone
        return timezone.now().isoformat()

    @database_sync_to_async
    def message_to_dict(self, message_obj):
        """
        Chuyển đổi đối tượng Message thành dict một cách an toàn trong ngữ cảnh đồng bộ.

        """

        data = {
            'id': message_obj.id,
            'content': message_obj.content,
            'username': message_obj.user.username if message_obj.user else 'Anonymous',
            'chat_room_id': message_obj.chat_room.id,
            'timestamp': message_obj.timestamp.isoformat()
        }
        print(data)

        return data
