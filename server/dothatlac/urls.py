from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenRefreshView
)
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('users', views.UserView, basename='users')
router.register('posts', views.PostView, basename='posts')
router.register('chatrooms', views.ChatroomView, basename='chatrooms')
router.register('tags', views.TagView, basename='tags')
router.register('categories', views.CategoryView, basename='categories')
router.register('postimages', views.PostImageView, basename='postimages')

urlpatterns = [
    path('', include(router.urls)),
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),  # login
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]