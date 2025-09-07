import json
from django.db.models import Q, F
from rest_framework import viewsets, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from .models import User, Post, PostImage, ChatRoom, Tag, Category, FCMToken, Notification
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from cloudinary import uploader
from .serializers import (MyTokenObtainPairSerializer, CategorySerializer, ChatRoomSerializer,
                          PostSerializer, PostImageSerializer, TagSerializer,
                          UserRegistrationSerializers, UserPostSerializer, NotificationSerializer)
from rest_framework import status
import requests
from PIL import Image
from io import BytesIO
from dothatlac.search_image.image_extractor import image_extractor, find_similar
from google.oauth2 import id_token
from google.auth.transport import requests as requests_google
from dothatlac.utils.notification import send_approve_notification

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        res = super().post(request, *args, **kwargs)
        data = res.data
        refresh = data.pop('refresh', None)

        if refresh:
            res.set_cookie(
                key='refresh_token',
                value=refresh,
                httponly=True,
                samesite='Lax',
                path='/token/refresh/',
            )

        return res

class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh = request.COOKIES.get('refresh_token')
        if refresh:
            request.data['refresh'] = refresh
        return super().post(request, *args, **kwargs)

class AdminPostView(viewsets.ReadOnlyModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAdminUser]

    @action(methods=['patch'], detail=True, url_path='approve', permission_classes=[IsAdminUser])
    def approve(self, request, pk=None):
        post = self.get_object()
        post.status = 'approved'
        post.save(update_fields=['status'])

        # Create notification instance
        Notification.objects.create(
            title='Bài đăng đã được duyệt',
            body=f"'{post.title}' đã được duyệt.",
            link=post.id,
            is_read=False,
            user=post.user,
        )

        send_approve_notification(post.user, post)
        return Response({'ok': True}, status=status.HTTP_200_OK)

    @action(methods=['patch'], detail=True, url_path='reject', permission_classes=[IsAdminUser])
    def reject(self, request, pk=None):
        post = self.get_object()
        # reason = request.data.get('reason')
        post.status = 'rejected'
        post.save(update_fields=['status'])
        return Response({'ok': True}, status=status.HTTP_200_OK)

class SaveFCMTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        token = request.data.get("token")
        platform = request.data.get('platform')
        user = request.user
        if token:
            FCMToken.objects.update_or_create(token=token, defaults={'user': user, 'platform': platform})
            return Response({"message": "Token saved"}, status=status.HTTP_200_OK)
        return Response({"error": "Token missing"}, status=status.HTTP_400_BAD_REQUEST)

class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        token = request.data.get('token')
        try:
            # Verify idToken with Google
            id_info = id_token.verify_oauth2_token(token, requests_google.Request())

            email = id_info['email']
            username = id_info['name']

            user, created = User.get_or_create_user(email=email, username=username)

            # Create JWT Token
            refresh = RefreshToken.for_user(user)

            return Response({
                'access_token': str(refresh.access_token),
                "refresh": str(refresh),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'phone': getattr(user, 'phone', None),
                    'avatar': user.avatar if user.avatar else None,
                }
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=400)

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['patch'])
    def mark_read(self, request, pk=None):
        noti = self.get_object()
        noti.is_read = True
        noti.save(update_fields=["is_read"])
        return Response({"ok": True}, status=status.HTTP_200_OK)

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

    @action(detail=True, methods=['get'])
    def notifications(self, request, pk=None):
        current_user = self.get_object()
        notifications = current_user.notifications.all()
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)

    def get_permissions(self):
        if self.request.method == 'POST':
            return [AllowAny()]
        return [IsAuthenticated()]

class PostView(viewsets.ViewSet, generics.CreateAPIView, generics.RetrieveAPIView,
               generics.ListAPIView, generics.RetrieveUpdateDestroyAPIView):
    parser_classes = [MultiPartParser, JSONParser]
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)  # PATCH = partial update
        instance = self.get_object()

        # Get images data from request
        images_data = request.FILES.getlist("images")

        # update another fields (title, description, phone, ...)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # Handle image
        if images_data is not None:
            for img in images_data:
                result = uploader.upload(img)
                image_url = result['secure_url']

                # Extract features from file
                response = requests.get(image_url)
                pil_img = Image.open(BytesIO(response.content)).convert("RGB")
                vector = image_extractor(pil_img)

                PostImage.objects.create(post=instance, image=image_url, image_vector=vector.tolist())

        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        data = request.data

        # Cast FK fields to int
        user_id = int(data.get('user_id')) if data.get('user_id') else None
        category_id = int(data.get('category_id')) if data.get('category_id') else None

        # Get the related object
        try:
            user = User.objects.get(id=user_id) if user_id else None
        except User.DoesNotExist:
            return Response({'error': 'User không tồn tại'}, status=400)

        try:
            category = Category.objects.get(id=category_id) if category_id else None
        except Category.DoesNotExist:
            return Response({'error': 'Category không tồn tại'}, status=400)

        # Create Post
        post = Post.objects.create(
            title=data.get('title', ''),
            description=data.get('description', ''),
            province=data.get('province', ''),
            district=data.get('district', ''),
            ward=data.get('ward', ''),
            phone=data.get('phone', ''),
            location=data.get('location', ''),
            type=data.get('type', 'found'),
            status='processing',
            user=user,
            category=category
        )

        # Handle multiple images (cloudinary + image vector)
        images = request.FILES.getlist('images')
        for img in images:
            # upload cloudinary
            result = uploader.upload(img)
            image_url = result['secure_url']

            # Extract features from file
            response = requests.get(image_url)
            pil_img = Image.open(BytesIO(response.content)).convert("RGB")
            vector = image_extractor(pil_img)

            PostImage.objects.create(post=post, image=image_url, image_vector=vector.tolist())

        # Handle tags
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

        # Return serialized data
        return Response(PostSerializer(post).data, status=201)

    @action(detail=False, methods=['post'])
    def batch(self, request):
        ids = request.data.get('ids', [])
        # Remove duplicates but keep first appearance order
        unique_ids = list(dict.fromkeys(ids))

        posts = Post.objects.filter(id__in=unique_ids)
        serializer = PostSerializer(posts, many=True)
        data = serializer.data

        # Map again by id
        post_map = {item["id"]: item for item in data}

        # Giữ nguyên thứ tự unique_ids
        ordered = [post_map[i] for i in unique_ids if i in post_map]

        return Response(ordered, status=status.HTTP_200_OK)

    def get_queryset(self):
        queryset = Post.objects
        kw = self.request.query_params.get('kw')
        category = self.request.query_params.get('category')
        city = self.request.query_params.get('city')
        st = self.request.query_params.get('st')

        if st:
            queryset = queryset.filter(status__iexact=st)

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

class PostImageView(viewsets.ViewSet, generics.ListAPIView, generics.DestroyAPIView):
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
