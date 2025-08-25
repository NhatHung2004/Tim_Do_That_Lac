from rest_framework.exceptions import ValidationError
from rest_framework.fields import URLField
from rest_framework.serializers import ModelSerializer
from dothatlac.models import User, Post
from cloudinary import uploader
import re

class UserSerializer(ModelSerializer):
    avatar = URLField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'phone', 'avatar']

class UserRegistrationSerializers(ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password', 'phone', 'avatar']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise ValidationError("A user with that email already exists.")
        return value

    def validate_phone(self, value):
        # Regex kiểm tra số điện thoại Việt Nam (bắt đầu bằng 0, 10 số)
        pattern = r'^0[0-9]{9}$'
        if not re.match(pattern, value):
            raise ValidationError("Invalid phone number.")

        return value

    def create(self, validated_data):
        avatar = validated_data.pop('avatar', None)

        user = User.objects.create_user(**validated_data)

        if avatar:
            result = uploader.upload(avatar)
            user.avatar = result['secure_url']
            user.save()

        return user

class PostSerializer(ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'title', 'description', 'province', 'district', 'ward', 'posted_time', 'location']

class UserPostSerializer(ModelSerializer):
    posts = PostSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'posts']
