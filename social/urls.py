from django.urls import path

from .views import (
    FeedView,
    PostCreateView,
    PostDeleteView,
    PostUpdateView,
    ProfilePostsView,
    contact_admin,
    conversation_detail,
    delete_conversation,
    dismiss_notification,
    respond_friend_request,
    send_friend_request,
    start_conversation,
    toggle_post_like,
)

app_name = 'social'

urlpatterns = [
    path('', FeedView.as_view(), name='feed'),
    path('posts/new/', PostCreateView.as_view(), name='post-create'),
    path('posts/<int:pk>/edit/', PostUpdateView.as_view(), name='post-update'),
    path('posts/<int:pk>/delete/', PostDeleteView.as_view(), name='post-delete'),
    path('posts/<int:pk>/like/', toggle_post_like, name='post-like'),
    path('profile/<int:pk>/posts/', ProfilePostsView.as_view(), name='profile-posts'),
    path('friends/request/<int:pk>/', send_friend_request, name='send-friend-request'),
    path('friends/request/<int:pk>/<str:action>/', respond_friend_request, name='respond-friend-request'),
    path('notifications/<int:pk>/dismiss/', dismiss_notification, name='dismiss-notification'),
    path('messages/start/<int:pk>/', start_conversation, name='conversation-start'),
    path('messages/<int:pk>/', conversation_detail, name='conversation-detail'),
    path('messages/<int:pk>/delete/', delete_conversation, name='conversation-delete'),
    path('contact-admin/', contact_admin, name='contact-admin'),
]
