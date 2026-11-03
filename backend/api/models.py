from django.db import models


class User1(models.Model):
    userid = models.AutoField(primary_key=True, db_column='userid')
    f_name = models.CharField(max_length=30, db_column='f_name')
    address = models.CharField(max_length=50, blank=True, null=True, db_column='address')
    mobile_no = models.BigIntegerField(db_column='mobile_no')
    email = models.CharField(max_length=50, unique=True, blank=True, null=True, db_column='email')

    class Meta:
        managed = False
        db_table = 'user1'
        ordering = ['userid']

    def __str__(self):
        return f"{self.f_name} (ID: {self.userid})"


class Order1(models.Model):
    order_id = models.AutoField(primary_key=True, db_column='order_id')
    user = models.ForeignKey(User1, on_delete=models.CASCADE, db_column='user_id', related_name='orders')
    item = models.CharField(max_length=50, db_column='item')
    quantity = models.IntegerField(db_column='quantity')
    price = models.DecimalField(max_digits=10, decimal_places=2, db_column='price')
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0, db_column='discount')
    total_price = models.DecimalField(max_digits=10, decimal_places=2, db_column='total_price')

    class Meta:
        managed = False
        db_table = 'orders1'
        ordering = ['-order_id']

    def __str__(self):
        return f"Order #{self.order_id} - {self.item} (Qty: {self.quantity})"


class Return1(models.Model):
    return_id = models.AutoField(primary_key=True, db_column='return_id')
    user = models.ForeignKey(User1, on_delete=models.CASCADE, db_column='user_id', related_name='returns')
    order = models.ForeignKey(Order1, on_delete=models.CASCADE, db_column='order_id', related_name='returns')
    item = models.CharField(max_length=50, blank=True, null=True, db_column='item')
    amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, db_column='amount')

    class Meta:
        managed = False
        db_table = 'returns1'
        ordering = ['-return_id']

    def __str__(self):
        return f"Return #{self.return_id} - Order #{self.order_id} ({self.item})"


class Complaint1(models.Model):
    complaint_id = models.AutoField(primary_key=True, db_column='complaint_id')
    user = models.ForeignKey(User1, on_delete=models.CASCADE, db_column='user_id', related_name='complaints')
    order = models.ForeignKey(Order1, on_delete=models.CASCADE, db_column='order_id', related_name='complaints')
    item = models.CharField(max_length=50, blank=True, null=True, db_column='item')
    complaint = models.CharField(max_length=200, blank=True, null=True, db_column='complaint')

    class Meta:
        managed = False
        db_table = 'complaint1'
        ordering = ['-complaint_id']

    def __str__(self):
        return f"Complaint #{self.complaint_id} on Order #{self.order_id}"


class Feedback1(models.Model):
    feedback_id = models.AutoField(primary_key=True, db_column='feedback_id')
    user = models.ForeignKey(User1, on_delete=models.CASCADE, db_column='user_id', related_name='feedbacks')
    feedback = models.CharField(max_length=200, blank=True, null=True, db_column='feedback')
    rating = models.IntegerField(blank=True, null=True, db_column='rating')

    class Meta:
        managed = False
        db_table = 'feedback1'
        ordering = ['-feedback_id']

    def __str__(self):
        return f"Feedback #{self.feedback_id} - Rating {self.rating}/5"


class Payment1(models.Model):
    payment_id = models.AutoField(primary_key=True, db_column='payment_id')
    user = models.ForeignKey(User1, on_delete=models.CASCADE, db_column='user_id', related_name='payments')
    order = models.ForeignKey(Order1, on_delete=models.CASCADE, db_column='order_id', related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, db_column='amount')
    status = models.CharField(max_length=20, blank=True, null=True, db_column='status')

    class Meta:
        managed = False
        db_table = 'payments1'
        ordering = ['-payment_id']

    def __str__(self):
        return f"Payment #{self.payment_id} - {self.status} (Rs. {self.amount})"


class Refund1(models.Model):
    refund_id = models.AutoField(primary_key=True, db_column='refund_id')
    user = models.ForeignKey(User1, on_delete=models.CASCADE, db_column='user_id', related_name='refunds')
    order = models.ForeignKey(Order1, on_delete=models.CASCADE, db_column='order_id', related_name='refunds')
    amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, db_column='amount')
    status = models.CharField(max_length=20, blank=True, null=True, db_column='status')

    class Meta:
        managed = False
        db_table = 'refund1'
        ordering = ['-refund_id']

    def __str__(self):
        return f"Refund #{self.refund_id} - {self.status} (Rs. {self.amount})"


class Status1(models.Model):
    status_id = models.AutoField(primary_key=True, db_column='status_id')
    order = models.ForeignKey(Order1, on_delete=models.CASCADE, db_column='order_id', related_name='statuses')
    status = models.CharField(max_length=20, blank=True, null=True, db_column='status')
    updated_at = models.DateTimeField(blank=True, null=True, db_column='updated_at')

    class Meta:
        managed = False
        db_table = 'status1'
        ordering = ['-status_id']

    def __str__(self):
        return f"Status for Order #{self.order_id}: {self.status}"


class OrderLog(models.Model):
    log_id = models.AutoField(primary_key=True, db_column='log_id')
    order = models.ForeignKey(Order1, on_delete=models.CASCADE, db_column='order_id', related_name='logs')
    action_type = models.CharField(max_length=30, blank=True, null=True, db_column='action_type')
    action_time = models.DateTimeField(blank=True, null=True, db_column='action_time')

    class Meta:
        managed = False
        db_table = 'order_logs'
        ordering = ['-log_id']

    def __str__(self):
        return f"Log #{self.log_id} - Order #{self.order_id} ({self.action_type})"
