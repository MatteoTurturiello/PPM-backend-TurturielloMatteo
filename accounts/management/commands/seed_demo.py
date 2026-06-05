from io import BytesIO

from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from PIL import Image, ImageDraw

from social.models import Conversation, FriendRequest, Friendship, Message, Post


class Command(BaseCommand):
    help = 'Populate database with demo users and sample social data.'

    def _build_avatar(self, color):
        image = Image.new('RGB', (320, 320), color)
        draw = ImageDraw.Draw(image)
        draw.ellipse((70, 70, 250, 250), fill='#fef08a')
        draw.ellipse((118, 124, 144, 150), fill='#1f2937')
        draw.ellipse((176, 124, 202, 150), fill='#1f2937')
        draw.arc((115, 140, 205, 225), start=15, end=165, fill='#1f2937', width=8)
        buffer = BytesIO()
        image.save(buffer, format='PNG', optimize=True)
        return ContentFile(buffer.getvalue())

    def _build_post_image(self, background, accent):
        image = Image.new('RGB', (720, 720), background)
        draw = ImageDraw.Draw(image)
        draw.rounded_rectangle((80, 90, 640, 630), radius=120, fill=accent)
        draw.ellipse((180, 220, 300, 340), fill='#ffffff')
        draw.ellipse((420, 220, 540, 340), fill='#ffffff')
        draw.ellipse((220, 255, 260, 295), fill='#111827')
        draw.ellipse((460, 255, 500, 295), fill='#111827')
        draw.arc((220, 260, 500, 470), start=20, end=160, fill='#ffffff', width=18)
        buffer = BytesIO()
        image.save(buffer, format='PNG', optimize=True)
        return ContentFile(buffer.getvalue())

    def handle(self, *args, **options):
        User = get_user_model()

        users_data = [
            {'username': 'admin_demo', 'password': 'admin12345', 'role': 'moderator', 'is_staff': True, 'is_superuser': True, 'bio': 'Amministratore demo.'},
            {'username': 'manager_demo', 'password': 'manager12345', 'role': 'moderator', 'bio': 'Moderatore della piattaforma.'},
            {'username': 'user_demo', 'password': 'user12345', 'role': 'standard', 'bio': 'Utente standard principale.'},
            {'username': 'user_friend', 'password': 'user12345', 'role': 'standard', 'bio': 'Utente amico per il feed.'},
        ]

        avatar_colors = {
            'admin_demo': '#c084fc',
            'manager_demo': '#60a5fa',
            'user_demo': '#f472b6',
            'user_friend': '#34d399',
        }

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
            if not user.profile_image:
                avatar = self._build_avatar(avatar_colors[username])
                user.profile_image.save(f'{username}-avatar.png', avatar, save=False)
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
            (
                created_users['user_demo'],
                'Ciao a tutti! Questo è il mio primo post demo 😊',
                ('#fdf2f8', '#f472b6'),
            ),
            (
                created_users['user_friend'],
                'Benvenuti nel feed: qui trovi contenuti degli amici ✨',
                ('#ecfeff', '#38bdf8'),
            ),
            (
                created_users['manager_demo'],
                'Ricorda: i moderatori possono rimuovere contenuti inappropriati 👍',
                ('#eff6ff', '#818cf8'),
            ),
        ]

        for author, content, colors in demo_posts:
            post, _ = Post.objects.get_or_create(author=author, content=content)
            if not post.image:
                post.image.save(
                    f'post-{author.username}.png',
                    self._build_post_image(*colors),
                    save=False,
                )
                post.save(update_fields=['image'])

        demo_post = Post.objects.filter(author=created_users['user_demo']).first()
        friend_post = Post.objects.filter(author=created_users['user_friend']).first()
        if demo_post:
            demo_post.liked_by.add(created_users['user_friend'], created_users['manager_demo'])
        if friend_post:
            friend_post.liked_by.add(created_users['user_demo'])

        conversation = Conversation.objects.get_or_create(
            user1_id=min(created_users['user_demo'].pk, created_users['user_friend'].pk),
            user2_id=max(created_users['user_demo'].pk, created_users['user_friend'].pk),
        )[0]
        Message.objects.get_or_create(
            conversation=conversation,
            sender=created_users['user_demo'],
            content='Ciao! Ho appena caricato una foto nuova 📷',
        )
        Message.objects.get_or_create(
            conversation=conversation,
            sender=created_users['user_friend'],
            content='Vista! Il nuovo layout sembra davvero più social 😄',
        )

        self.stdout.write(self.style.SUCCESS('Database demo popolato con successo.'))
