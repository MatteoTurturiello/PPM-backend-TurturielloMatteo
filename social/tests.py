import shutil
import tempfile

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from django.urls import reverse
from PIL import Image

from .models import Conversation, Friendship, Message, Post

User = get_user_model()


def build_test_image(name='test.png', size=(32, 32), color='#f472b6'):
    temp_file = tempfile.NamedTemporaryFile(suffix='.png')
    image = Image.new('RGB', size, color)
    image.save(temp_file, format='PNG')
    temp_file.seek(0)
    return SimpleUploadedFile(name, temp_file.read(), content_type='image/png')


TEMP_MEDIA_ROOT = tempfile.mkdtemp()


@override_settings(MEDIA_ROOT=TEMP_MEDIA_ROOT)
class SocialFlowTests(TestCase):
    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        shutil.rmtree(TEMP_MEDIA_ROOT, ignore_errors=True)

    def setUp(self):
        self.user = User.objects.create_user(username='user_demo', password='testpass123')
        self.friend = User.objects.create_user(username='user_friend', password='testpass123')
        self.other = User.objects.create_user(username='outsider', password='testpass123')
        Friendship.objects.create(user1=self.friend, user2=self.user)
        self.post = Post.objects.create(author=self.friend, content='Post con immagine', image=build_test_image())
        self.client.login(username='user_demo', password='testpass123')

    def test_like_toggle_adds_and_removes_like(self):
        like_url = reverse('social:post-like', args=[self.post.pk])

        self.client.post(like_url, {'next': reverse('social:feed')})
        self.post.refresh_from_db()
        self.assertTrue(self.post.liked_by.filter(pk=self.user.pk).exists())

        self.client.post(like_url, {'next': reverse('social:feed')})
        self.post.refresh_from_db()
        self.assertFalse(self.post.liked_by.filter(pk=self.user.pk).exists())

    def test_start_conversation_and_send_message(self):
        response = self.client.get(reverse('social:conversation-start', args=[self.friend.pk]))
        conversation = Conversation.objects.get()
        self.assertRedirects(response, reverse('social:conversation-detail', args=[conversation.pk]))

        detail_url = reverse('social:conversation-detail', args=[conversation.pk])
        response = self.client.post(detail_url, {'content': 'Ciao con emoji 😊'})
        self.assertRedirects(response, detail_url)
        self.assertTrue(Message.objects.filter(conversation=conversation, sender=self.user, content='Ciao con emoji 😊').exists())

    def test_delete_conversation_requires_participant(self):
        conversation = Conversation.objects.create(user1=self.user, user2=self.friend)
        self.client.logout()
        self.client.login(username='outsider', password='testpass123')

        response = self.client.post(reverse('social:conversation-delete', args=[conversation.pk]))
        self.assertEqual(response.status_code, 403)
        self.assertTrue(Conversation.objects.filter(pk=conversation.pk).exists())
