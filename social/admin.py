from django.contrib import admin

from .models import FriendRequest, Friendship, Post

admin.site.register(Post)
admin.site.register(Friendship)
admin.site.register(FriendRequest)
