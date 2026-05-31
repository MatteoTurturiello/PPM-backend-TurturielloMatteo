from django.contrib import messages
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LoginView
from django.shortcuts import get_object_or_404, redirect, render
from django.views.generic import CreateView, DetailView, ListView, UpdateView

from social.models import Notification

from .forms import BannedAwareAuthenticationForm, ProfileForm, UserRegistrationForm
from .mixins import ModeratorRequiredMixin

User = get_user_model()


class SignUpView(CreateView):
    form_class = UserRegistrationForm
    template_name = 'registration/signup.html'
    success_url = '/accounts/login/'


class CustomLoginView(LoginView):
    form_class = BannedAwareAuthenticationForm


class ProfileDetailView(LoginRequiredMixin, DetailView):
    model = User
    template_name = 'accounts/profile_detail.html'
    context_object_name = 'profile_user'


class UserListView(LoginRequiredMixin, ListView):
    model = User
    template_name = 'accounts/user_list.html'
    context_object_name = 'users'

    def get_queryset(self):
        return User.objects.exclude(pk=self.request.user.pk).order_by('username')


class ProfileUpdateView(LoginRequiredMixin, UpdateView):
    model = User
    form_class = ProfileForm
    template_name = 'accounts/profile_form.html'

    def get_success_url(self):
        return self.object.get_absolute_url()

    def get_queryset(self):
        return User.objects.filter(pk=self.request.user.pk)


class ModeratorUserListView(ModeratorRequiredMixin, ListView):
    model = User
    template_name = 'accounts/moderation_users.html'
    context_object_name = 'users'

    def get_queryset(self):
        return User.objects.order_by('username')


@login_required
def toggle_user_status(request, pk):
    if not request.user.is_moderator():
        messages.error(request, 'Solo i moderatori possono disattivare o riattivare account.')
        return redirect('social:feed')

    target = get_object_or_404(User, pk=pk)
    if target.pk == request.user.pk:
        messages.error(request, 'Non puoi modificare il tuo stato account.')
        return redirect('accounts:moderation-users')

    target.is_active = not target.is_active
    target.save(update_fields=['is_active'])
    if not target.is_active:
        Notification.objects.create(
            user=target,
            message='Il tuo account è stato sospeso da un moderatore.',
        )
    else:
        Notification.objects.create(
            user=target,
            message='Il tuo account è stato riattivato da un moderatore.',
        )
    messages.success(request, f"Stato account di {target.username} aggiornato.")
    return redirect('accounts:moderation-users')


def home_redirect(request):
    if request.user.is_authenticated:
        return redirect('social:feed')
    return render(request, 'accounts/home.html')
