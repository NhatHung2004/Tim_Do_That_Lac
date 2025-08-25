from rest_framework.relations import PrimaryKeyRelatedField
from rest_framework.serializers import ModelSerializer
from dothatlac.models import PostImage, Post, User, Category, Tag
from dothatlac.serializers import user_serializer
from dothatlac.serializers import category_serializer

class PostImageSerializer(ModelSerializer):
    class Meta:
        model = PostImage
        fields = ['id', 'image']

class TagsPostSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class PostSerializer(ModelSerializer):
    images = PostImageSerializer(source='postimage_set', many=True, read_only=True)
    tags = TagsPostSerializer(many=True, read_only=True)
    user = user_serializer.UserSerializer(read_only=True)
    user_id = PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        write_only=True,
        source='user'
    )
    category = category_serializer.CategorySerializer(read_only=True)
    category_id = PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        write_only=True,
        source='category'
    )

    class Meta:
        model = Post
        fields = ['id', 'title', 'description', 'province', 'district', 'ward', 'location',
                  'posted_time', 'type', 'user', 'category', 'category_id', 'user_id', 'images', "tags"]
