import os
import uuid

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.core.mail import send_mail
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from PIL import Image


class User(AbstractUser):
    CLIENT = 1
    SELLER = 2

    ROLE_CHOICES = (
        (CLIENT, "Client"),
        (SELLER, "Seller"),
    )
    role = models.PositiveSmallIntegerField(choices=ROLE_CHOICES, blank=True, null=True)

    def get_role_name(self):
        for choice in self.ROLE_CHOICES:
            if choice[0] == self.role:
                return choice[1]
        return None

    def __str__(self):
        return self.username


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    def upload_to(self, filename):
        _, extension = os.path.splitext(filename)
        uid = uuid.uuid4()
        return f"{uid}{extension}"

    def generate_thumbnail(self):
        if self.image:
            img = Image.open(self.image)
            img.thumbnail((200, 200))
            thumbnail_path = self.upload_to(os.path.basename(self.image.name))
            thumbnail_path_with_media_root = os.path.join(
                settings.MEDIA_ROOT, thumbnail_path
            )
            img.save(thumbnail_path_with_media_root)
            self.thumbnail = thumbnail_path

    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    image = models.ImageField(upload_to=upload_to)
    thumbnail = models.ImageField(upload_to=upload_to, blank=True, null=True)

    def save(self, *args, **kwargs):
        if self._state.adding or (
            self.image and self.image != self._meta.model.objects.get(pk=self.pk).image
        ):
            self.generate_thumbnail()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Order(models.Model):
    def create_payment_due_date():
        return timezone.now() + timezone.timedelta(days=5)

    client = models.ForeignKey(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    delivery_address = models.TextField(max_length=255)
    order_date = models.DateTimeField(auto_now_add=True)
    payment_due_date = models.DateTimeField(default=create_payment_due_date)
    total_price = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )

    def __str__(self):
        return f"Order #{self.pk}"


@receiver(post_save, sender=Order)
def send_email_after_creating_order(sender, instance, **kwargs):
    if instance.total_price:
        send_mail(
            "Your order has been created",
            f"Remember to make a payment of {instance.total_price} PLN by {instance.payment_due_date}",
            settings.EMAIL_SENDER,
            [instance.client.email],
            fail_silently=False,
        )


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order, related_name="order_items", on_delete=models.CASCADE
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"Item {self.pk} in Order {self.order.pk}"
