from rest_framework.exceptions import ValidationError
from rest_framework.fields import URLField
from rest_framework.serializers import ModelSerializer
from dothatlac.models import User, Post, PostImage
from cloudinary import uploader

class UserSerializer(ModelSerializer):
    avatar = URLField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'full_name', 'avatar']

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

class PostImageSerializer(ModelSerializer):
    class Meta:
        model = PostImage
        fields = ['id', 'image']

class PostSerializer(ModelSerializer):
    images = PostImageSerializer(source='postimage_set', many=True, read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'title', 'description', 'province', 'district', 'ward', 'posted_time',
                  'location', 'phone', 'type', 'status', 'images']

class UserPostSerializer(ModelSerializer):
    posts = PostSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'posts']
