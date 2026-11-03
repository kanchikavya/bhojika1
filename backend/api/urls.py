from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    User1ViewSet,
    Order1ViewSet,
    Return1ViewSet,
    Complaint1ViewSet,
    Feedback1ViewSet,
    Payment1ViewSet,
    Refund1ViewSet,
    Status1ViewSet,
    OrderLogViewSet,
    dashboard_stats,
    analytics_view
)

router = DefaultRouter()
router.register(r'users', User1ViewSet, basename='user')
router.register(r'orders', Order1ViewSet, basename='order')
router.register(r'returns', Return1ViewSet, basename='return')
router.register(r'complaints', Complaint1ViewSet, basename='complaint')
router.register(r'feedback', Feedback1ViewSet, basename='feedback')
router.register(r'payments', Payment1ViewSet, basename='payment')
router.register(r'refunds', Refund1ViewSet, basename='refund')
router.register(r'status', Status1ViewSet, basename='status')
router.register(r'order-logs', OrderLogViewSet, basename='orderlog')

urlpatterns = [
    path('dashboard/stats/', dashboard_stats, name='dashboard-stats'),
    path('analytics/', analytics_view, name='analytics'),
    path('', include(router.urls)),
]
