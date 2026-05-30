from django import forms

from .models import Post


class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ('content',)
        widgets = {
            'content': forms.Textarea(attrs={'rows': 4, 'placeholder': 'A cosa stai pensando?'}),
        }

    def clean_content(self):
        content = self.cleaned_data['content'].strip()
        if len(content) < 3:
            raise forms.ValidationError('Il post deve contenere almeno 3 caratteri utili.')
        return content
