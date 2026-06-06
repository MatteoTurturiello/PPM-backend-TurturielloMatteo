from django import forms
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.core.exceptions import ValidationError

from PPMbackend.upload_validators import validate_small_image

from .models import User


class ProfileImageClearableFileInput(forms.ClearableFileInput):
    template_name = 'widgets/profile_image_input.html'


class BannedAwareAuthenticationForm(AuthenticationForm):
    def clean(self):
        username = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')
        try:
            return super().clean()
        except ValidationError:
            if username and password:
                try:
                    candidate = User.objects.get(**{User.USERNAME_FIELD: username})
                    if not candidate.is_active and candidate.check_password(password):
                        raise ValidationError(
                            'Il tuo account è stato sospeso. Contatta un moderatore per ulteriori informazioni.',
                            code='inactive',
                        )
                except User.DoesNotExist:
                    pass
            raise


class UserRegistrationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'bio', 'password1', 'password2')
        widgets = {
            'username': forms.TextInput(attrs={'placeholder': 'Scegli un username', 'data-i18n-placeholder': 'usernamePlaceholder'}),
            'first_name': forms.TextInput(attrs={'placeholder': 'Nome', 'data-i18n-placeholder': 'firstNamePlaceholder'}),
            'last_name': forms.TextInput(attrs={'placeholder': 'Cognome', 'data-i18n-placeholder': 'lastNamePlaceholder'}),
            'email': forms.EmailInput(attrs={'placeholder': 'email@esempio.it', 'data-i18n-placeholder': 'emailPlaceholder'}),
            'bio': forms.Textarea(attrs={'rows': 4, 'placeholder': 'Racconta qualcosa di te', 'data-i18n-placeholder': 'bioPlaceholder'}),
        }


class ProfileForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'bio', 'profile_image')
        widgets = {
            'first_name': forms.TextInput(attrs={'placeholder': 'Nome', 'data-i18n-placeholder': 'firstNamePlaceholder'}),
            'last_name': forms.TextInput(attrs={'placeholder': 'Cognome', 'data-i18n-placeholder': 'lastNamePlaceholder'}),
            'email': forms.EmailInput(attrs={'placeholder': 'email@esempio.it', 'data-i18n-placeholder': 'emailPlaceholder'}),
            'bio': forms.Textarea(attrs={'rows': 4, 'placeholder': 'Racconta qualcosa di te', 'data-i18n-placeholder': 'bioPlaceholder'}),
            'profile_image': ProfileImageClearableFileInput(),
        }

    def clean_profile_image(self):
        return validate_small_image(self.cleaned_data.get('profile_image'))
