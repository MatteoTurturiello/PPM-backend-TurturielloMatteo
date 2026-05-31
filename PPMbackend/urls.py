from django.contrib import admin
from django.http import HttpResponse
from django.urls import include, path

from accounts.views import CustomLoginView


def healthz(request):
    return HttpResponse('ok', content_type='text/plain')


urlpatterns = [
    path('healthz/', healthz, name='healthz'),
    path('admin/', admin.site.urls),
    path('accounts/login/', CustomLoginView.as_view(), name='login'),
    path('accounts/', include('accounts.urls')),
    path('accounts/', include('django.contrib.auth.urls')),
    path('', include('social.urls')),
]
