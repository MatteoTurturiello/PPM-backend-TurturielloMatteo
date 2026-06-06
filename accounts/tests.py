from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.urls import reverse

from PPMbackend.upload_validators import MAX_IMAGE_SIZE_BYTES

from .forms import ProfileForm

User = get_user_model()


class ProfileFormTests(TestCase):
    def test_profile_form_rejects_oversized_image(self):
        user = User.objects.create_user(username='form_user', password='testpass123')
        huge_file = SimpleUploadedFile(
            'too-big.png',
            b'a' * (MAX_IMAGE_SIZE_BYTES + 10),
            content_type='image/png',
        )

        form = ProfileForm(
            data={
                'first_name': '',
                'last_name': '',
                'email': '',
                'bio': '',
            },
            files={'profile_image': huge_file},
            instance=user,
        )

        self.assertFalse(form.is_valid())
        self.assertIn('profile_image', form.errors)


class ProfileUpdateViewTests(TestCase):
    def test_profile_edit_page_renders_successfully(self):
        user = User.objects.create_user(username='view_user', password='testpass123')
        self.client.force_login(user)

        response = self.client.get(reverse('accounts:profile-edit', kwargs={'pk': user.pk}))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'data-i18n-key="chooseFileAction"')
