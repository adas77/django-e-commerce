from datetime import timedelta

import django
from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone

django.setup()

from api.models import Order


@shared_task
def send_payment_reminder():
    time_offset = timezone.now() + timedelta(days=1)

    orders_to_remind = Order.objects.filter(payment_due_date__lt=time_offset)

    for order in orders_to_remind:
        send_mail(
            "Payment Reminder",
            f"Remember to make a payment of {order.total_price} PLN by {order.payment_due_date}",
            settings.EMAIL_SENDER,
            [order.client.email],
            fail_silently=False,
        )
