from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.http import HttpResponse


def health_check(request):
    return HttpResponse("Food Fiesta API is running", status=200)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('health/', health_check, name='health-check'),
    # Catch-all route to serve the React SPA for any frontend route
    re_path(r'^(?!api|admin|static).*$', TemplateView.as_view(template_name='index.html'), name='react-app'),
]
