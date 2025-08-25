from rest_framework.serializers import ModelSerializer
from dothatlac.models import ChatRoom, User

class UserSerializerForChatRoom(ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'avatar')

class ChatRoomSerializer(ModelSerializer):
    user1 = UserSerializerForChatRoom(read_only=True)
    user2 = UserSerializerForChatRoom(read_only=True)

    class Meta:
        model = ChatRoom
        fields = ['id', 'room_name', 'created_at', 'user1', 'user2']