from django.contrib.auth.models import AbstractUser
from django.db import models
from django.urls import reverse


class User(AbstractUser):
    class Roles(models.TextChoices):
        STANDARD = 'standard', 'Standard User'
        MODERATOR = 'moderator', 'Moderator'

    role = models.CharField(max_length=20, choices=Roles.choices, default=Roles.STANDARD)
    bio = models.TextField(blank=True)

    def is_moderator(self):
        return self.role == self.Roles.MODERATOR

    def get_absolute_url(self):
        return reverse('accounts:profile-detail', kwargs={'pk': self.pk})
