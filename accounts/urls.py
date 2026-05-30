from django.urls import path

from .views import (
    ModeratorUserListView,
    ProfileDetailView,
    ProfileUpdateView,
    SignUpView,
    UserListView,
    home_redirect,
    toggle_user_status,
)

app_name = 'accounts'

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('moderation/users/', ModeratorUserListView.as_view(), name='moderation-users'),
    path('moderation/users/<int:pk>/toggle/', toggle_user_status, name='toggle-user-status'),
    path('profile/<int:pk>/', ProfileDetailView.as_view(), name='profile-detail'),
    path('profile/<int:pk>/edit/', ProfileUpdateView.as_view(), name='profile-edit'),
    path('', home_redirect, name='home'),
]
