from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from social.models import FriendRequest, Friendship, Post


class Command(BaseCommand):
    help = 'Populate database with demo users and sample social data.'

    def handle(self, *args, **options):
        User = get_user_model()

        users_data = [
            {'username': 'admin_demo', 'password': 'admin12345', 'role': 'moderator', 'is_staff': True, 'is_superuser': True, 'bio': 'Amministratore demo.'},
            {'username': 'manager_demo', 'password': 'manager12345', 'role': 'moderator', 'bio': 'Moderatore della piattaforma.'},
            {'username': 'user_demo', 'password': 'user12345', 'role': 'standard', 'bio': 'Utente standard principale.'},
            {'username': 'user_friend', 'password': 'user12345', 'role': 'standard', 'bio': 'Utente amico per il feed.'},
        ]

        created_users = {}
        for data in users_data:
            username = data.pop('username')
            password = data.pop('password')
            user, created = User.objects.get_or_create(username=username, defaults=data)
            user.role = data.get('role', user.role)
            user.is_staff = data.get('is_staff', user.is_staff)
            user.is_superuser = data.get('is_superuser', user.is_superuser)
            user.bio = data.get('bio', user.bio)
            user.set_password(password)
            user.save()
            created_users[username] = user
            msg = 'Creato' if created else 'Aggiornato'
            self.stdout.write(self.style.SUCCESS(f'{msg} utente {username}'))

        friend_a = created_users['user_demo']
        friend_b = created_users['user_friend']
        first, second = sorted([friend_a.pk, friend_b.pk])
        Friendship.objects.get_or_create(user1_id=first, user2_id=second)

        FriendRequest.objects.get_or_create(
            from_user=created_users['manager_demo'],
            to_user=created_users['user_demo'],
            defaults={'status': FriendRequest.Status.PENDING},
        )

        demo_posts = [
            (created_users['user_demo'], 'Ciao a tutti! Questo è il mio primo post demo.'),
            (created_users['user_friend'], 'Benvenuti nel feed: qui trovi contenuti degli amici.'),
            (created_users['manager_demo'], 'Ricorda: i moderatori possono rimuovere contenuti inappropriati.'),
        ]

        for author, content in demo_posts:
            Post.objects.get_or_create(author=author, content=content)

        self.stdout.write(self.style.SUCCESS('Database demo popolato con successo.'))
