from rest_framework.serializers import ModelSerializer
from dothatlac.models import Tag

class TagSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']
