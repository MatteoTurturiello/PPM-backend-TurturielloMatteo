from django.db.models import Q
from django.urls import reverse

from .models import Conversation


def social_shell(request):
    if not request.user.is_authenticated:
        return {}

    conversations = (
        Conversation.objects.filter(Q(user1=request.user) | Q(user2=request.user))
        .select_related('user1', 'user2')
        .order_by('-updated_at')
    )

    conversation_items = []
    for conversation in conversations:
        other_user = conversation.other_participant(request.user)
        last_message = conversation.messages.order_by('-created_at').values_list('content', flat=True).first()
        preview = last_message or 'Apri la chat per iniziare la conversazione.'
        if len(preview) > 48:
            preview = f'{preview[:48]}…'
        conversation_items.append(
            {
                'id': conversation.pk,
                'title': other_user.username,
                'subtitle': preview,
                'url': reverse('social:conversation-detail', kwargs={'pk': conversation.pk}),
                'deleteUrl': reverse('social:conversation-delete', kwargs={'pk': conversation.pk}),
                'avatarUrl': other_user.profile_image.url if other_user.profile_image else '',
                'updatedAt': conversation.updated_at.strftime('%d/%m %H:%M'),
            }
        )

    settings_links = [
        {'label': 'Il mio profilo', 'url': reverse('accounts:profile-detail', kwargs={'pk': request.user.pk})},
        {'label': 'Modifica profilo', 'url': reverse('accounts:profile-edit', kwargs={'pk': request.user.pk})},
        {'label': 'Scopri utenti', 'url': reverse('accounts:user-list')},
    ]
    if request.user.is_moderator():
        settings_links.append({'label': 'Moderazione account', 'url': reverse('accounts:moderation-users')})

    return {
        'social_shell_data': {
            'conversations': conversation_items,
            'settingsLinks': settings_links,
            'csrfToken': request.COOKIES.get('csrftoken', ''),
            'nextUrl': request.get_full_path(),
        }
    }
