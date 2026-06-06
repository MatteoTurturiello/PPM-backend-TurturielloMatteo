from django import forms

from PPMbackend.upload_validators import validate_small_image

from .models import Message, Post


class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ('content', 'image')
        widgets = {
            'content': forms.Textarea(
                attrs={
                    'rows': 4,
                    'placeholder': 'Condividi un pensiero, una foto o una emoji ✨',
                    'class': 'post-composer__textarea',
                    'data-i18n-placeholder': 'postContentPlaceholder',
                }
            ),
        }

    def clean_content(self):
        content = self.cleaned_data['content'].strip()
        if len(content) < 3:
            raise forms.ValidationError('Il post deve contenere almeno 3 caratteri utili.')
        return content

    def clean_image(self):
        return validate_small_image(self.cleaned_data.get('image'))


class MessageForm(forms.ModelForm):
    class Meta:
        model = Message
        fields = ('content',)
        widgets = {
            'content': forms.Textarea(
                attrs={
                    'rows': 3,
                    'placeholder': 'Scrivi un messaggio o aggiungi una emoji 💬',
                    'data-i18n-placeholder': 'chatMessagePlaceholder',
                }
            ),
        }

    def clean_content(self):
        content = self.cleaned_data['content'].strip()
        if len(content) < 1:
            raise forms.ValidationError('Il messaggio non può essere vuoto.')
        return content
