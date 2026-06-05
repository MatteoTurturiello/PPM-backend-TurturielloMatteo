from django.contrib import messages
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.exceptions import PermissionDenied
from django.db.models import Q
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse, reverse_lazy
from django.views.generic import CreateView, DeleteView, ListView, UpdateView

from .forms import MessageForm, PostForm
from .models import Conversation, FriendRequest, Friendship, Notification, Post

User = get_user_model()


def _notify_post_deleted_by_moderator(post):
    """Create an in-app notification for the post author when a moderator deletes their post."""
    Notification.objects.create(
        user_id=post.author_id,
        message='Il tuo post è stato eliminato da un moderatore.',
    )


def friendship_filter_for(user):
    return Q(friendships_initiated__user2=user) | Q(friendships_received__user1=user)


def is_friend(user_a, user_b):
    first, second = sorted([user_a.pk, user_b.pk])
    return Friendship.objects.filter(user1_id=first, user2_id=second).exists()


def can_view_profile_posts(viewer, owner):
    return viewer.pk == owner.pk or viewer.is_moderator() or is_friend(viewer, owner)


def get_or_create_conversation(user_a, user_b):
    first, second = sorted([user_a.pk, user_b.pk])
    conversation, _ = Conversation.objects.get_or_create(user1_id=first, user2_id=second)
    return conversation


class FeedView(LoginRequiredMixin, ListView):
    model = Post
    template_name = 'social/feed.html'
    context_object_name = 'posts'

    def get_queryset(self):
        base_queryset = Post.objects.select_related('author').prefetch_related('liked_by')
        if self.request.user.is_moderator():
            return base_queryset.all()
        friend_ids = User.objects.filter(friendship_filter_for(self.request.user)).values_list('id', flat=True)
        visible_ids = list(friend_ids) + [self.request.user.id]
        return base_queryset.filter(author_id__in=visible_ids)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['pending_requests'] = FriendRequest.objects.filter(
            to_user=self.request.user,
            status=FriendRequest.Status.PENDING,
        ).select_related('from_user')
        context['unread_notifications'] = Notification.objects.filter(user=self.request.user, read=False)
        context['liked_post_ids'] = set(self.request.user.liked_posts.values_list('id', flat=True))
        context['page_title'] = 'Feed'
        return context


class ProfilePostsView(LoginRequiredMixin, ListView):
    model = Post
    template_name = 'social/profile_posts.html'
    context_object_name = 'posts'

    def get_queryset(self):
        return Post.objects.filter(author=self.profile_owner).select_related('author').prefetch_related('liked_by')

    def dispatch(self, request, *args, **kwargs):
        self.profile_owner = get_object_or_404(User, pk=kwargs['pk'])
        if not can_view_profile_posts(request.user, self.profile_owner):
            messages.error(request, 'Puoi vedere i post di un utente solo se siete amici.')
            return redirect('social:feed')
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['profile_owner'] = self.profile_owner
        context['liked_post_ids'] = set(self.request.user.liked_posts.values_list('id', flat=True))
        context['page_title'] = 'I miei post' if self.request.user.pk == self.profile_owner.pk else f'Post di {self.profile_owner.username}'
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

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title'] = 'Nuovo post'
        return context


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

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title'] = 'Modifica post'
        return context


class PostDeleteView(LoginRequiredMixin, DeleteView):
    model = Post
    template_name = 'social/post_confirm_delete.html'
    success_url = reverse_lazy('social:feed')

    def dispatch(self, request, *args, **kwargs):
        post = self.get_object()
        if post.author_id != request.user.id and not request.user.is_moderator():
            raise PermissionDenied('Non hai i permessi per eliminare questo post.')
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        post = self.get_object()
        if self.request.user.pk != post.author_id:
            _notify_post_deleted_by_moderator(post)
        messages.success(self.request, 'Post eliminato.')
        return super().form_valid(form)


@login_required
def toggle_post_like(request, pk):
    post = get_object_or_404(Post.objects.select_related('author'), pk=pk)
    if not can_view_profile_posts(request.user, post.author):
        raise PermissionDenied('Non puoi mettere like a questo post.')

    if post.liked_by.filter(pk=request.user.pk).exists():
        post.liked_by.remove(request.user)
        messages.info(request, 'Hai rimosso il like dal post.')
    else:
        post.liked_by.add(request.user)
        messages.success(request, 'Hai messo like al post.')

    if request.POST.get('return_view') == 'profile-posts':
        return redirect('social:profile-posts', pk=post.author_id)
    return redirect('social:feed')


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


@login_required
def start_conversation(request, pk):
    target = get_object_or_404(User, pk=pk)
    if target.pk == request.user.pk:
        messages.error(request, 'Non puoi avviare una chat con te stesso.')
        return redirect(target.get_absolute_url())

    conversation = get_or_create_conversation(request.user, target)
    return redirect('social:conversation-detail', pk=conversation.pk)


@login_required
def conversation_detail(request, pk):
    conversation = get_object_or_404(Conversation.objects.select_related('user1', 'user2'), pk=pk)
    if request.user.pk not in {conversation.user1_id, conversation.user2_id}:
        raise PermissionDenied('Non puoi accedere a questa chat.')

    other_user = conversation.other_participant(request.user)
    if request.method == 'POST':
        form = MessageForm(request.POST)
        if form.is_valid():
            message = form.save(commit=False)
            message.conversation = conversation
            message.sender = request.user
            message.save()
            messages.success(request, 'Messaggio inviato.')
            return redirect('social:conversation-detail', pk=conversation.pk)
    else:
        form = MessageForm()

    return render(
        request,
        'social/conversation_detail.html',
        {
            'conversation': conversation,
            'other_user': other_user,
            'chat_messages': conversation.messages.select_related('sender'),
            'form': form,
            'page_title': f'Chat con {other_user.username}',
        },
    )


@login_required
def delete_conversation(request, pk):
    conversation = get_object_or_404(Conversation, pk=pk)
    if request.user.pk not in {conversation.user1_id, conversation.user2_id}:
        raise PermissionDenied('Non puoi eliminare questa chat.')

    conversation.delete()
    messages.info(request, 'Chat eliminata.')
    return redirect('social:feed')
