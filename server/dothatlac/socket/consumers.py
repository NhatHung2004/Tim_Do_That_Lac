import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model


class ChatConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.room_group_name = None
        self.room_name = None
        self.user = None
        self.other_user = None
        self.chat_room_obj = None

    # thiết lập kết nối
    async def connect(self):
        # if self.scope["user"].is_anonymous:
        #     await self.close()
        #     print("Anonymous user tried to connect to chat, connection closed.")
        #     return

        self.user = self.scope['user'] # lấy curent_user

        # lấy user đăng nhắn tin theo id trên query_string
        other_user_id = self.scope['url_route']['kwargs'].get('other_user_id')

        try:
            self.other_user = await self.get_user_by_id(other_user_id) # lấy user theo id
            if not self.other_user:
                await self.close()
                print(f"Other user with ID {other_user_id} not found.")
                return
        except ValueError:  # other_user_id là giá trị không hợp lệ
            await self.close()
            print(f"Invalid other_user_id: {other_user_id}")
            return

        # tạo mới hoặc lấy ChatRoom nếu đã tồn tại
        self.chat_room_obj, created = await self.get_or_create_chat_room(user_a=self.user, user_b=self.other_user)
        # lấy tên phòng cho instance consumer
        self.room_name = self.chat_room_obj.room_name
        self.room_group_name = f'chat_{self.room_name}'

        # tạo 1 chanel và thêm vào room_group_name
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name # tên duy nhất của mỗi instance Consumer
        )

        await self.accept() # chấp nhận kết nối WebSocket
        print(f"WebSocket connected: {self.channel_name} (User: {self.user.username}) to room "
              f"{self.room_name} with {self.other_user.username}")

        # lấy lichj sử tin nhắn cũ
        old_messages = await self.get_old_messages(self.chat_room_obj)
        for msg in old_messages:
            message_dict = await self.message_to_dict(msg)
            await self.send(text_data=json.dumps(message_dict)) # trả về client

    # đóng kêt nối
    async def disconnect(self, close_code):
        # xoá chanel khỏi room_group_name
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        print(f"WebSocket disconnected: {self.channel_name} from room {self.room_name}")

    # channel layer xử lý data đến từ client
    async def receive(self, text_data):
        text_data_json = json.loads(text_data) # chuyển JSON thành Python dict
        # lấy field content được gửi từ client
        message_content = text_data_json['content']

        # current_user
        username = self.user.username if self.user and not self.user.is_anonymous else 'Anonymous'

        # lưu tin nhắn vào db
        await self.save_message(self.chat_room_obj, self.user, message_content)

        # gửi tin nhắn đến room_group_name, toàn bộ consumer trong room_group_name đều nhận được
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat.message',
                'content': message_content,
                'username': username,
                'chat_room_name': self.room_name,
                'timestamp': await self.get_current_time_iso() # lấy thời gian hiện tại
            }
        )
        print(f"Received message: '{message_content}' from {username} in room {self.room_name}")

    # gửi tin nhắn lại cho client
    # event sẽ lưu data từ group_send
    async def chat_message(self, event):
        content = event['content']
        username = event['username']
        chat_room_name = event['chat_room_name']
        timestamp = event.get('timestamp')

        # chuyển Python dict thành JSON và trả về client
        await self.send(text_data=json.dumps({
            'content': content,
            'username': username,
            'chat_room_name': chat_room_name,
            'timestamp': timestamp
        }))
        print(f"Sent message: '{content}' from {username} to client {self.channel_name}")


    ''' CÁC HÀM ĐỒNG BỘ '''
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
