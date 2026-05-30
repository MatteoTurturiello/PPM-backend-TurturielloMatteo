from django.contrib import messages
from django.contrib.auth.mixins import UserPassesTestMixin
from django.shortcuts import redirect


class ModeratorRequiredMixin(UserPassesTestMixin):
    def test_func(self):
        return self.request.user.is_authenticated and self.request.user.is_moderator()

    def handle_no_permission(self):
        messages.error(self.request, 'Non hai i permessi per eseguire questa azione.')
        return redirect('social:feed')
