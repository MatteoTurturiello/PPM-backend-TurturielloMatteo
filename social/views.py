from django.contrib import messages
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.exceptions import PermissionDenied
from django.db.models import Q
from django.shortcuts import get_object_or_404, redirect
from django.urls import reverse_lazy
from django.views.generic import CreateView, DeleteView, ListView, UpdateView

from .forms import PostForm
from .models import FriendRequest, Friendship, Notification, Post

User = get_user_model()


def friendship_filter_for(user):
    return Q(friendships_initiated__user2=user) | Q(friendships_received__user1=user)


def is_friend(user_a, user_b):
    first, second = sorted([user_a.pk, user_b.pk])
    return Friendship.objects.filter(user1_id=first, user2_id=second).exists()


class FeedView(LoginRequiredMixin, ListView):
    model = Post
    template_name = 'social/feed.html'
    context_object_name = 'posts'

    def get_queryset(self):
        if self.request.user.is_moderator():
            return Post.objects.select_related('author').all()
        friend_ids = User.objects.filter(friendship_filter_for(self.request.user)).values_list('id', flat=True)
        visible_ids = list(friend_ids) + [self.request.user.id]
        return Post.objects.select_related('author').filter(author_id__in=visible_ids)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['pending_requests'] = FriendRequest.objects.filter(
            to_user=self.request.user,
            status=FriendRequest.Status.PENDING,
        ).select_related('from_user')
        context['unread_notifications'] = Notification.objects.filter(
            user=self.request.user, read=False
        )
        return context


class ProfilePostsView(LoginRequiredMixin, ListView):
    model = Post
    template_name = 'social/profile_posts.html'
    context_object_name = 'posts'

    def get_queryset(self):
        return Post.objects.filter(author=self.profile_owner).select_related('author')

    def dispatch(self, request, *args, **kwargs):
        self.profile_owner = get_object_or_404(User, pk=kwargs['pk'])
        if (
            request.user.pk != self.profile_owner.pk
            and not is_friend(request.user, self.profile_owner)
            and not request.user.is_moderator()
        ):
            messages.error(request, 'Puoi vedere i post di un utente solo se siete amici.')
            return redirect('social:feed')
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['profile_owner'] = self.profile_owner
        return context


class PostCreateView(LoginRequiredMixin, CreateView):
    model = Post
    form_class = PostForm
    template_name = 'social/post_form.html'
    success_url = reverse_lazy('social:feed')

    def form_valid(self, form):
        form.instance.author = self.request.user
        messages.success(self.request, 'Post creato con successo.')
        return super().form_valid(form)


class PostUpdateView(LoginRequiredMixin, UpdateView):
    model = Post
    form_class = PostForm
    template_name = 'social/post_form.html'
    success_url = reverse_lazy('social:feed')

    def dispatch(self, request, *args, **kwargs):
        post = self.get_object()
        if post.author_id != request.user.id:
            raise PermissionDenied('Puoi modificare solo i tuoi post.')
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        messages.success(self.request, 'Post aggiornato.')
        return super().form_valid(form)


class PostDeleteView(LoginRequiredMixin, DeleteView):
    model = Post
    template_name = 'social/post_confirm_delete.html'
    success_url = reverse_lazy('social:feed')

    def dispatch(self, request, *args, **kwargs):
        post = self.get_object()
        if post.author_id != request.user.id and not request.user.is_moderator():
            raise PermissionDenied('Non hai i permessi per eliminare questo post.')
        return super().dispatch(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        post = self.get_object()
        if request.user.pk != post.author_id:
            Notification.objects.create(
                user_id=post.author_id,
                message='Il tuo post è stato eliminato da un moderatore.',
            )
        messages.success(self.request, 'Post eliminato.')
        return super().delete(request, *args, **kwargs)


@login_required
def send_friend_request(request, pk):
    target = get_object_or_404(User, pk=pk)
    if target.pk == request.user.pk:
        messages.error(request, 'Non puoi inviare richieste a te stesso.')
        return redirect('accounts:user-list')

    if is_friend(request.user, target):
        messages.info(request, 'Siete già amici.')
        return redirect('accounts:user-list')

    if FriendRequest.objects.filter(from_user=request.user, to_user=target, status=FriendRequest.Status.PENDING).exists():
        messages.info(request, 'Richiesta già inviata.')
        return redirect('accounts:user-list')

    FriendRequest.objects.get_or_create(from_user=request.user, to_user=target)
    messages.success(request, 'Richiesta di amicizia inviata.')
    return redirect('accounts:user-list')


@login_required
def respond_friend_request(request, pk, action):
    friend_request = get_object_or_404(
        FriendRequest,
        pk=pk,
        to_user=request.user,
        status=FriendRequest.Status.PENDING,
    )

    if action == 'accept':
        friend_request.status = FriendRequest.Status.ACCEPTED
        first, second = sorted([friend_request.from_user_id, friend_request.to_user_id])
        Friendship.objects.get_or_create(user1_id=first, user2_id=second)
        messages.success(request, 'Richiesta accettata.')
    elif action == 'reject':
        friend_request.status = FriendRequest.Status.REJECTED
        messages.info(request, 'Richiesta rifiutata.')
    else:
        messages.error(request, 'Azione non valida.')
        return redirect('social:feed')

    friend_request.save(update_fields=['status'])
    return redirect('social:feed')


@login_required
def dismiss_notification(request, pk):
    notification = get_object_or_404(Notification, pk=pk, user=request.user)
    notification.read = True
    notification.save(update_fields=['read'])
    return redirect('social:feed')
