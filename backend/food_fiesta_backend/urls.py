from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def api_root(request):
    return JsonResponse({
        'name': 'Food Fiesta - Restaurant Management System API',
        'version': '2.0.0',
        'framework': 'Django REST Framework & MySQL',
        'endpoints': {
            'dashboard_stats': '/api/dashboard/stats/',
            'analytics': '/api/analytics/',
            'users': '/api/users/',
            'orders': '/api/orders/',
            'payments': '/api/payments/',
            'returns': '/api/returns/',
            'refunds': '/api/refunds/',
            'complaints': '/api/complaints/',
            'feedback': '/api/feedback/',
            'status': '/api/status/',
            'order_logs': '/api/order-logs/',
        }
    })


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', api_root, name='api-root'),
    path('api/', include('api.urls')),
]
