from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    full_name = models.CharField(max_length=255, null=True, blank=True)
    avatar = models.URLField(null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)

    def __str__(self):
        return f'{self.first_name} {self.last_name}'

    @classmethod
    def get_or_create_user(cls, username, email):
        user = cls.objects.filter(email=email).first()
        if user:
            if user.username != username:
                user.username = username
                user.save(update_fields=["username"])
            created = False
        else:
            user = cls.objects.create(username=username, email=email)
            created = True
        return user, created

class FCMToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='fcm_tokens')
    token = models.CharField(max_length=255)
    platform = models.CharField(
        max_length=20,
        null=True,
        blank=True
    )
    last_used = models.DateTimeField(auto_now=True)  # Last time token was confirmed
    class Meta:
        unique_together = ('user', 'token')  # A user has multiple devices but not save duplicate tokens

    def __str__(self):
        return f"FCMToken(user={self.user.username}, device={self.device_type})"

class Category(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Post(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField(max_length=500, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True)
    province = models.CharField(max_length=150, null=True, blank=True)
    district = models.CharField(max_length=150, null=True, blank=True)
    ward = models.CharField(max_length=150, null=True, blank=True)
    location = models.CharField(max_length=200)
    posted_time = models.DateTimeField(auto_now_add=True)
    type = models.CharField(max_length=50, default='found')
    status = models.CharField(max_length=50, default='processing')

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='posts')

    class Meta:
        ordering = ['-posted_time']

    def __str__(self):
        return self.title

class Tag(models.Model):
    name = models.CharField(max_length=100)
    posts = models.ManyToManyField(Post, related_name='tags')

    def __str__(self):
        return self.name

class PostImage(models.Model):
    image = models.URLField(null=True, blank=True)
    image_vector = models.JSONField(null=True, blank=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.image)

class ChatRoom(models.Model):
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_rooms_as_user1')
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_rooms_as_user2')
    room_name = models.CharField(max_length=255, unique=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Ensure each pair of users has only one chat room, regardless of order
        unique_together = [['user1', 'user2']]

    def __str__(self):
        return f"ChatRoom: {self.name} ({self.user1.username} - {self.user2.username})"

    # Get or create chat room
    @classmethod
    def get_or_create_room(cls, user_a, user_b):
        # Make sure user_a.id < user_b.id to keep room names consistent
        if user_a.id > user_b.id:
            user_a, user_b = user_b, user_a # Swap if user_a greater

        room_name = f'private_{user_a.id}_{user_b.id}'
        room, created = cls.objects.get_or_create(
            user1=user_a,
            user2=user_b,
            defaults={'room_name': room_name}
        )
        return room, created

class Message(models.Model):
    chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, null=True, blank=True, related_name='messages')
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='sent_messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"Message from {self.user.username if self.user else 'Anonymous'} in {self.chat_room.room_name}: {self.content[:50]}"

    def to_dict(self):
        return {
            'id': self.id,
            'user': self.user.username if self.user else 'Anonymous',
            'chat_room_name': self.chat_room.name,
            'content': self.content,
            'timestamp': self.timestamp.isoformat(),
        }

class Comment(models.Model):
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')

    class Meta:
        ordering = ['created_at']

class Notification(models.Model):
    title = models.CharField(max_length=255)
    body = models.TextField()
    link = models.CharField(max_length=255, null=True, blank=True)
    reason = models.CharField(max_length=255, null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')

    class Meta:
        ordering = ['created_at']
