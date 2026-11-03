from rest_framework import serializers
from decimal import Decimal
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


class User1Serializer(serializers.ModelSerializer):
    orders_count = serializers.SerializerMethodField(read_only=True)
    total_spent = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User1
        fields = ['userid', 'f_name', 'address', 'mobile_no', 'email', 'orders_count', 'total_spent']

    def get_orders_count(self, obj):
        try:
            return obj.orders.count()
        except Exception:
            return 0

    def get_total_spent(self, obj):
        try:
            total = sum([o.total_price for o in obj.orders.all() if o.total_price])
            return float(total)
        except Exception:
            return 0.0


class Order1Serializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.f_name', read_only=True)
    user_mobile = serializers.IntegerField(source='user.mobile_no', read_only=True)
    current_status = serializers.SerializerMethodField(read_only=True)
    payment_status = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order1
        fields = [
            'order_id',
            'user',
            'user_name',
            'user_mobile',
            'item',
            'quantity',
            'price',
            'discount',
            'total_price',
            'current_status',
            'payment_status'
        ]
        extra_kwargs = {
            'total_price': {'required': False}
        }

    def validate(self, attrs):
        quantity = attrs.get('quantity')
        price = attrs.get('price')
        discount = attrs.get('discount', Decimal('0'))

        if quantity is not None and price is not None:
            calc_total = (Decimal(price) * quantity) - Decimal(discount)
            if calc_total < 0:
                calc_total = Decimal('0')
            attrs['total_price'] = attrs.get('total_price') or calc_total

        return attrs

    def get_current_status(self, obj):
        try:
            latest_status = obj.statuses.order_by('-updated_at', '-status_id').first()
            return latest_status.status if latest_status else 'pending'
        except Exception:
            return 'pending'

    def get_payment_status(self, obj):
        try:
            pmt = obj.payments.order_by('-payment_id').first()
            return pmt.status if pmt else 'unpaid'
        except Exception:
            return 'unpaid'


class Return1Serializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.f_name', read_only=True)
    order_item = serializers.CharField(source='order.item', read_only=True)

    class Meta:
        model = Return1
        fields = ['return_id', 'user', 'user_name', 'order', 'order_item', 'item', 'amount']


class Complaint1Serializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.f_name', read_only=True)
    order_item = serializers.CharField(source='order.item', read_only=True)

    class Meta:
        model = Complaint1
        fields = ['complaint_id', 'user', 'user_name', 'order', 'order_item', 'item', 'complaint']


class Feedback1Serializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.f_name', read_only=True)

    class Meta:
        model = Feedback1
        fields = ['feedback_id', 'user', 'user_name', 'feedback', 'rating']

    def validate_rating(self, value):
        if value is not None and (value < 1 or value > 5):
            raise serializers.ValidationError("Rating must be an integer between 1 and 5.")
        return value


class Payment1Serializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.f_name', read_only=True)
    order_item = serializers.CharField(source='order.item', read_only=True)

    class Meta:
        model = Payment1
        fields = ['payment_id', 'user', 'user_name', 'order', 'order_item', 'amount', 'status']


class Refund1Serializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.f_name', read_only=True)
    order_item = serializers.CharField(source='order.item', read_only=True)

    class Meta:
        model = Refund1
        fields = ['refund_id', 'user', 'user_name', 'order', 'order_item', 'amount', 'status']


class Status1Serializer(serializers.ModelSerializer):
    order_item = serializers.CharField(source='order.item', read_only=True)
    user_name = serializers.CharField(source='order.user.f_name', read_only=True)

    class Meta:
        model = Status1
        fields = ['status_id', 'order', 'order_item', 'user_name', 'status', 'updated_at']


class OrderLogSerializer(serializers.ModelSerializer):
    order_item = serializers.CharField(source='order.item', read_only=True)

    class Meta:
        model = OrderLog
        fields = ['log_id', 'order', 'order_item', 'action_type', 'action_time']
