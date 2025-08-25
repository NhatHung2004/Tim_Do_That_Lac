from django.urls import re_path
from dothatlac.socket import consumers

websocket_urlpatterns = [
    # Đường dẫn cho chat 1-1: ws/chat/<other_user_id>/
    re_path(r'ws/chat/(?P<other_user_id>\d+)/$', consumers.ChatConsumer.as_asgi()),
]