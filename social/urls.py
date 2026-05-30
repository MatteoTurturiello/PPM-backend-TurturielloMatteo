from django.urls import path

from .views import (
    FeedView,
    PostCreateView,
    PostDeleteView,
    PostUpdateView,
    ProfilePostsView,
    respond_friend_request,
    send_friend_request,
)

app_name = 'social'

urlpatterns = [
    path('', FeedView.as_view(), name='feed'),
    path('posts/new/', PostCreateView.as_view(), name='post-create'),
    path('posts/<int:pk>/edit/', PostUpdateView.as_view(), name='post-update'),
    path('posts/<int:pk>/delete/', PostDeleteView.as_view(), name='post-delete'),
    path('profile/<int:pk>/posts/', ProfilePostsView.as_view(), name='profile-posts'),
    path('friends/request/<int:pk>/', send_friend_request, name='send-friend-request'),
    path('friends/request/<int:pk>/<str:action>/', respond_friend_request, name='respond-friend-request'),
]
