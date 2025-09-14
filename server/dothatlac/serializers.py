from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import ValidationError
from rest_framework.relations import PrimaryKeyRelatedField
from rest_framework.serializers import ModelSerializer
from dothatlac.models import PostImage, Post, User, Category, Tag, ChatRoom, Notification, Comment
import re
from rest_framework.fields import URLField
from cloudinary import uploader

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        data['user'] = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'full_name': user.full_name,
            'avatar': user.avatar if user.avatar else None,
        }
        return data # type: ignore

# TAG SERIALIZER
class TagSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

# CATEGORY SERIALIZER
class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

# POSTIMAGE SERIALIZER
class PostImageSerializer(ModelSerializer):
    class Meta:
        model = PostImage
        fields = ['id', 'image']

# USER SERIALIZER
class UserSerializer(ModelSerializer):
    avatar = URLField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'full_name', 'avatar']

class UserUpdateSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name', 'avatar']

# POST SERIALIZER
class PostSerializer(ModelSerializer):
    images = PostImageSerializer(source='postimage_set', many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)
    user_id = PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        write_only=True,
        source='user'
    )
    category = CategorySerializer(read_only=True)
    category_id = PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        write_only=True,
        source='category'
    )

    class Meta:
        model = Post
        fields = ['id', 'title', 'description', 'province', 'district', 'ward', 'location', 'phone', 'status',
                  'posted_time', 'type', 'user', 'category', 'category_id', 'user_id', 'images', "tags"]

    def validate_phone(self, value):
        # Regex kiểm tra số điện thoại Việt Nam (bắt đầu bằng 0, 10 số)
        pattern = r'^0[0-9]{9}$'
        if not re.match(pattern, value):
            raise ValidationError("Số điện thoại không hợp lệ.")

        return value


# USER SERIALIZER
class UserRegistrationSerializers(ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'avatar', 'full_name']
        extra_kwargs = {'password': {'write_only': True}, 'avatar': {'read_only': True}}

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise ValidationError("Email đã tồn tại.")
        return value

    def create(self, validated_data):
        avatar = validated_data.pop('avatar', None)

        user = User.objects.create_user(**validated_data)

        if avatar:
            result = uploader.upload(avatar)
            user.avatar = result['secure_url']
            user.save()

        return user

class UserPostSerializer(ModelSerializer):
    posts = PostSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'posts']

# CHATROOM SERIALIZER
class ChatRoomSerializer(ModelSerializer):
    user1 = UserSerializer(read_only=True)
    user2 = UserSerializer(read_only=True)

    class Meta:
        model = ChatRoom
        fields = ['id', 'room_name', 'created_at', 'user1', 'user2']

# NOTIFICATION
class NotificationSerializer(ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'body', 'created_at', 'user_id', 'link', 'is_read', 'reason']

# COMMENT
class CommentSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        write_only=True,
        source='user'
    )
    post_id = PrimaryKeyRelatedField(
        queryset=Post.objects.all(),
        write_only=True,
        source='post'
    )
    post = PostSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'content', 'created_at', 'post', 'user', 'user_id', 'post_id']
