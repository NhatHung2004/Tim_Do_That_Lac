import json
from django.db.models import Q, F
from rest_framework import viewsets, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import User, Post, PostImage, ChatRoom, Tag, Category
from rest_framework_simplejwt.views import TokenObtainPairView
from cloudinary import uploader
from .serializers.category_serializer import CategorySerializer
from .serializers.chat_room_serializer import ChatRoomSerializer
from .serializers.post_serializer import PostSerializer, PostImageSerializer
from .serializers.tag_serializer import TagSerializer
from .serializers.user_serializer import UserRegistrationSerializers, UserPostSerializer
from .serializers.auth_serializer import MyTokenObtainPairSerializer
from rest_framework import status
import requests
from PIL import Image
from io import BytesIO
from dothatlac.search_image.image_extractor import image_extractor, find_similar

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class UserView(viewsets.ViewSet, generics.CreateAPIView, generics.RetrieveAPIView,
               generics.ListAPIView, generics.DestroyAPIView, generics.UpdateAPIView):
    serializer_class = UserRegistrationSerializers
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = UserRegistrationSerializers(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def posts(self, request, pk=None):
        user = self.get_object()
        serializer = UserPostSerializer(user)
        return Response(serializer.data)

    def get_permissions(self):
        if self.request.method == 'POST':
            return [AllowAny()]
        return [IsAuthenticated()]

class PostView(viewsets.ViewSet, generics.CreateAPIView, generics.RetrieveAPIView, generics.ListAPIView):
    parser_classes = [MultiPartParser, JSONParser]
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        data = request.data.copy()

        # Ép các field FK sang int
        user_id = int(data.get('user_id')) if data.get('user_id') else None
        category_id = int(data.get('category_id')) if data.get('category_id') else None

        # Lấy object liên quan
        try:
            user = User.objects.get(id=user_id) if user_id else None
        except User.DoesNotExist:
            return Response({'error': 'User không tồn tại'}, status=400)

        try:
            category = Category.objects.get(id=category_id) if category_id else None
        except Category.DoesNotExist:
            return Response({'error': 'Category không tồn tại'}, status=400)

        # Tạo Post
        post = Post.objects.create(
            title=data.get('title', ''),
            description=data.get('description', ''),
            province=data.get('province', ''),
            district=data.get('district', ''),
            ward=data.get('ward', ''),
            location=data.get('location', ''),
            type=data.get('type', 'found'),
            status='processing',
            user=user,
            category=category
        )

        # Xử lý nhiều ảnh (cloudinary + image vector)
        images = request.FILES.getlist('images')
        for img in images:
            # upload cloudinary
            result = uploader.upload(img)
            image_url = result['secure_url']

            # Trích xuất feature từ file
            response = requests.get(image_url)
            pil_img = Image.open(BytesIO(response.content)).convert("RGB")

            # Lưu tạm file trong RAM để extract
            # pil_img.save("temp.jpg")
            vector = image_extractor(pil_img)

            PostImage.objects.create(post=post, image=image_url, image_vector=vector.tolist())

        # Xử lý tags
        if request.data.get('tags'):
            tags_json = request.data.get('tags', [])
            tags = json.loads(tags_json)
            for tag in tags:
                tag_to_add = Tag.objects.filter(name=tag).first()

                if tag_to_add:
                    post.tags.add(tag_to_add)
                else:
                    tag_creation = Tag.objects.create(name=tag)
                    post.tags.add(tag_creation)

        # Trả về dữ liệu serialized
        return Response(PostSerializer(post).data, status=201)

    @action(detail=False, methods=['post'])
    def batch(self, request):
        ids = request.data.get('ids', [])
        # Loại bỏ duplicate nhưng vẫn giữ nguyên thứ tự xuất hiện đầu tiên
        unique_ids = list(dict.fromkeys(ids))

        posts = Post.objects.filter(id__in=unique_ids)
        serializer = PostSerializer(posts, many=True)
        data = serializer.data

        # Map lại theo id
        post_map = {item["id"]: item for item in data}

        # Giữ nguyên thứ tự unique_ids
        ordered = [post_map[i] for i in unique_ids if i in post_map]

        return Response(ordered, status=status.HTTP_200_OK)

    def get_queryset(self):
        queryset = Post.objects

        post_type = self.request.query_params.get('type')
        kw = self.request.query_params.get('kw')
        category = self.request.query_params.get('category')
        city = self.request.query_params.get('city')

        if post_type:
            queryset = queryset.filter(type=post_type)

        if kw:
            queryset = queryset.filter(Q(title__icontains=kw) | Q(description__icontains=kw))

        if category:
            cate = Category.objects.get(name__iexact=category)
            queryset = queryset.filter(category=cate)

        if city:
            queryset = queryset.filter(Q(province=city) | Q(district=city) | Q(ward=city))

        return queryset

    def get_permissions(self):
        if self.request.method == 'GET' or self.action == 'batch':
            return [AllowAny()]
        return [IsAuthenticated()]

class ChatroomView(viewsets.ViewSet, generics.ListAPIView):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        current_user = self.request.user
        queryset = ChatRoom.objects

        if current_user.is_authenticated:
            queryset = queryset.filter(~Q(user1=F('user2'))
                                           & (Q(user1=current_user) | Q(user2=current_user))).order_by('-created_at')
        return queryset

class TagView(viewsets.ViewSet, generics.ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Tag.objects.all()[:5]

class CategoryView(viewsets.ViewSet, generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class PostImageView(viewsets.ViewSet, generics.ListAPIView):
    queryset = PostImage.objects.all()
    serializer_class = PostImageSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'], url_path="search-image")
    def search_by_image(self, request, pk=None):
        files = request.FILES.getlist('images')
        if not files:
            return Response({'error': 'No file found'}, status=status.HTTP_404_NOT_FOUND)

        all_results = []

        for f in files:
            try:
                img = Image.open(f).convert("RGB")
                query_vec = image_extractor(img)  # ResNet extract vector
                results = find_similar(query_vec)

                all_results.append({
                    "filename": f.name,
                    "results": results
                })
            except Exception as e:
                all_results.append({
                    "filename": f.name,
                    "error": str(e)
                })

        return Response({"all_results": all_results}, status=status.HTTP_200_OK)
