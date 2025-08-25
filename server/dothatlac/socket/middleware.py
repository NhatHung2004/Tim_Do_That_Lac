from channels.auth import AuthMiddlewareStack
from channels.db import database_sync_to_async
from urllib.parse import parse_qs


@database_sync_to_async
def get_user_from_token(scope):
    """
    Tìm người dùng dựa trên token được cung cấp trong query string của WebSocket.
    """
    from django.contrib.auth.models import AnonymousUser
    from rest_framework_simplejwt.tokens import AccessToken
    from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
    from django.contrib.auth import get_user_model

    try:
        # Lấy query string từ scope
        query_string = parse_qs(scope["query_string"].decode("utf8"))

        # Lấy token từ query string.
        token_key = query_string.get("token")
        print("TOKEN KEY", token_key[0])

        if token_key:
            access_token = token_key[0]
            user_model = get_user_model()
            access_token = AccessToken(access_token)
            user_id = access_token['user_id']
            user = user_model.objects.get(id=user_id)
            return user

    except (InvalidToken, TokenError) as e:
        print("Token does not exist or is invalid.")
    except Exception as e:
        print(f"Error getting user from token: {e}")

    return AnonymousUser()  # Trả về người dùng ẩn danh nếu không tìm thấy / xác thực được


class TokenAuthMiddleware:
    """
    Middleware tùy chỉnh để xác thực người dùng dựa trên token trong query string.
    """

    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        # Thiết lập scope['user'] trước khi chuyển cho middleware tiếp theo
        scope["user"] = await get_user_from_token(scope)
        return await self.inner(scope, receive, send)


# Đây là Stack sẽ sử dụng trong asgi.py
TokenAuthMiddlewareStack = lambda inner: TokenAuthMiddleware(AuthMiddlewareStack(inner))