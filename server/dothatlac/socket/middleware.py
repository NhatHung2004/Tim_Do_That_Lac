from channels.auth import AuthMiddlewareStack
from channels.db import database_sync_to_async
from urllib.parse import parse_qs


@database_sync_to_async
def get_user_from_token(scope):
    """
    Find users based on token provided in the WebSocket query string
    """
    from django.contrib.auth.models import AnonymousUser
    from rest_framework_simplejwt.tokens import AccessToken
    from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
    from django.contrib.auth import get_user_model

    try:
        # Get query string from scope
        query_string = parse_qs(scope["query_string"].decode("utf8"))

        # Get token from query string
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

    return AnonymousUser()  # return Anonymous User if not found/authenticated


class TokenAuthMiddleware:
    """
    Custom middleware to authenticate users based on token provided in the WebSocket query string
    """

    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        # Set scope['user'] before passing to next middleware
        scope["user"] = await get_user_from_token(scope)
        return await self.inner(scope, receive, send)


# This is the Stack that will be user in asgi.py
TokenAuthMiddlewareStack = lambda inner: TokenAuthMiddleware(AuthMiddlewareStack(inner))