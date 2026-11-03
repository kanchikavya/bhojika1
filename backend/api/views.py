from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.db.models import Sum, Avg, Count, Max, Min, Q
from decimal import Decimal
from django.utils import timezone

from .models import (
    User1,
    Order1,
    Return1,
    Complaint1,
    Feedback1,
    Payment1,
    Refund1,
    Status1,
    OrderLog
)
from .serializers import (
    User1Serializer,
    Order1Serializer,
    Return1Serializer,
    Complaint1Serializer,
    Feedback1Serializer,
    Payment1Serializer,
    Refund1Serializer,
    Status1Serializer,
    OrderLogSerializer
)


class User1ViewSet(viewsets.ModelViewSet):
    queryset = User1.objects.all()
    serializer_class = User1Serializer

    def get_queryset(self):
        qs = super().get_queryset()
        search = self.request.query_params.get('search', None)
        if search:
            qs = qs.filter(
                Q(f_name__icontains=search) |
                Q(email__icontains=search) |
                Q(address__icontains=search) |
                Q(mobile_no__icontains=search)
            )
        return qs

    @action(detail=True, methods=['get'])
    def orders(self, request, pk=None):
        user = self.get_object()
        orders = Order1.objects.filter(user=user)
        serializer = Order1Serializer(orders, many=True)
        return Response(serializer.data)


class Order1ViewSet(viewsets.ModelViewSet):
    queryset = Order1.objects.all().select_related('user')
    serializer_class = Order1Serializer

    def get_queryset(self):
        qs = super().get_queryset()
        user_id = self.request.query_params.get('user_id', None)
        item = self.request.query_params.get('item', None)
        search = self.request.query_params.get('search', None)

        if user_id:
            qs = qs.filter(user_id=user_id)
        if item:
            qs = qs.filter(item__icontains=item)
        if search:
            qs = qs.filter(
                Q(item__icontains=search) |
                Q(user__f_name__icontains=search)
            )
        return qs

    def perform_create(self, serializer):
        order = serializer.save()
        # Ensure status, log, and payment entries exist
        try:
            Status1.objects.get_or_create(order=order, defaults={'status': 'pending'})
            OrderLog.objects.create(order=order, action_type='new order')
            Payment1.objects.get_or_create(
                order=order,
                user=order.user,
                defaults={'amount': order.total_price, 'status': 'pending'}
            )
        except Exception:
            pass

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status', 'pending')
        status_entry, created = Status1.objects.get_or_create(order=order)
        status_entry.status = new_status
        status_entry.updated_at = timezone.now()
        status_entry.save()

        OrderLog.objects.create(
            order=order,
            action_type=f'status updated to {new_status}'
        )

        return Response({
            'message': f'Status updated to {new_status}',
            'status': new_status,
            'order_id': order.order_id
        })


class Return1ViewSet(viewsets.ModelViewSet):
    queryset = Return1.objects.all().select_related('user', 'order')
    serializer_class = Return1Serializer

    def perform_create(self, serializer):
        ret = serializer.save()
        try:
            # Update order status to returned
            status_entry, _ = Status1.objects.get_or_create(order=ret.order)
            status_entry.status = 'returned'
            status_entry.save()

            OrderLog.objects.create(
                order=ret.order,
                action_type='order returned'
            )
        except Exception:
            pass


class Complaint1ViewSet(viewsets.ModelViewSet):
    queryset = Complaint1.objects.all().select_related('user', 'order')
    serializer_class = Complaint1Serializer

    def get_queryset(self):
        qs = super().get_queryset()
        search = self.request.query_params.get('search', None)
        if search:
            qs = qs.filter(
                Q(item__icontains=search) |
                Q(complaint__icontains=search) |
                Q(user__f_name__icontains=search)
            )
        return qs


class Feedback1ViewSet(viewsets.ModelViewSet):
    queryset = Feedback1.objects.all().select_related('user')
    serializer_class = Feedback1Serializer

    @action(detail=False, methods=['get'])
    def summary(self, request):
        total = Feedback1.objects.count()
        avg_rating = Feedback1.objects.aggregate(avg=Avg('rating'))['avg'] or 0
        distribution = {}
        for star in range(1, 6):
            cnt = Feedback1.objects.filter(rating=star).count()
            distribution[star] = cnt

        return Response({
            'total_feedbacks': total,
            'average_rating': round(float(avg_rating), 2),
            'rating_distribution': distribution
        })


class Payment1ViewSet(viewsets.ModelViewSet):
    queryset = Payment1.objects.all().select_related('user', 'order')
    serializer_class = Payment1Serializer

    def get_queryset(self):
        qs = super().get_queryset()
        st = self.request.query_params.get('status', None)
        if st:
            qs = qs.filter(status__iexact=st)
        return qs

    @action(detail=True, methods=['post'])
    def mark_status(self, request, pk=None):
        pmt = self.get_object()
        new_status = request.data.get('status', 'completed')
        pmt.status = new_status
        pmt.save()
        return Response({'message': f'Payment marked as {new_status}', 'status': new_status})


class Refund1ViewSet(viewsets.ModelViewSet):
    queryset = Refund1.objects.all().select_related('user', 'order')
    serializer_class = Refund1Serializer

    def perform_create(self, serializer):
        refund = serializer.save()
        try:
            # Update matching payment to refunded
            pmt = Payment1.objects.filter(order=refund.order).first()
            if pmt:
                pmt.status = 'refunded'
                pmt.save()

            OrderLog.objects.create(
                order=refund.order,
                action_type='refund processed'
            )
        except Exception:
            pass


class Status1ViewSet(viewsets.ModelViewSet):
    queryset = Status1.objects.all().select_related('order', 'order__user')
    serializer_class = Status1Serializer


class OrderLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = OrderLog.objects.all().select_related('order')
    serializer_class = OrderLogSerializer


@api_view(['GET'])
def dashboard_stats(request):
    """
    Returns high-level business metrics and distributions for the dashboard.
    """
    total_users = User1.objects.count()
    total_orders = Order1.objects.count()
    total_returns = Return1.objects.count()
    total_payments = Payment1.objects.count()
    total_refunds = Refund1.objects.count()

    revenue_agg = Order1.objects.aggregate(
        total=Sum('total_price'),
        avg=Avg('total_price'),
        max=Max('total_price'),
        min=Min('total_price')
    )
    total_revenue = float(revenue_agg['total'] or 0)
    avg_order = float(revenue_agg['avg'] or 0)
    max_order = float(revenue_agg['max'] or 0)
    min_order = float(revenue_agg['min'] or 0)

    # Payment breakdown
    payments_by_status = list(
        Payment1.objects.values('status')
        .annotate(count=Count('payment_id'), total=Sum('amount'))
        .order_by('-count')
    )

    # Order status breakdown
    order_status_counts = list(
        Status1.objects.values('status')
        .annotate(count=Count('status_id'))
        .order_by('-count')
    )

    # Feedback average
    fb_agg = Feedback1.objects.aggregate(avg=Avg('rating'), count=Count('feedback_id'))
    avg_rating = round(float(fb_agg['avg'] or 0), 1)

    # Top items by sales count
    top_items = list(
        Order1.objects.values('item')
        .annotate(orders_count=Count('order_id'), total_sales=Sum('total_price'), total_quantity=Sum('quantity'))
        .order_by('-orders_count')[:6]
    )

    # Recent orders
    recent_orders = Order1Serializer(Order1.objects.all()[:5], many=True).data

    # Recent complaints
    recent_complaints = Complaint1Serializer(Complaint1.objects.all()[:5], many=True).data

    return Response({
        'overview': {
            'total_users': total_users,
            'total_orders': total_orders,
            'total_returns': total_returns,
            'total_payments': total_payments,
            'total_refunds': total_refunds,
            'total_revenue': total_revenue,
            'average_order_value': round(avg_order, 2),
            'highest_order_value': max_order,
            'lowest_order_value': min_order,
            'average_rating': avg_rating,
            'total_feedback': fb_agg['count'] or 0,
        },
        'payment_status_breakdown': payments_by_status,
        'order_status_breakdown': order_status_counts,
        'top_items': top_items,
        'recent_orders': recent_orders,
        'recent_complaints': recent_complaints,
    })


@api_view(['GET'])
def analytics_view(request):
    """
    Advanced SQL analytics: customer rankings, spending analysis, and order distributions.
    """
    # Customer spending rankings (equivalent to dense_rank window functions)
    customer_spend = (
        User1.objects.annotate(
            total_spent=Sum('orders__total_price'),
            orders_count=Count('orders')
        )
        .filter(total_spent__gt=0)
        .order_by('-total_spent')
    )

    ranked_customers = []
    current_rank = 1
    last_spent = None

    for idx, customer in enumerate(customer_spend, start=1):
        spent = float(customer.total_spent or 0)
        if last_spent is not None and spent < last_spent:
            current_rank += 1
        last_spent = spent

        ranked_customers.append({
            'rank': current_rank,
            'user_id': customer.userid,
            'name': customer.f_name,
            'email': customer.email,
            'mobile': customer.mobile_no,
            'orders_count': customer.orders_count,
            'total_spent': spent
        })

    # High value orders
    high_value_orders = Order1Serializer(
        Order1.objects.order_by('-total_price')[:5],
        many=True
    ).data

    return Response({
        'ranked_customers': ranked_customers,
        'high_value_orders': high_value_orders,
    })
