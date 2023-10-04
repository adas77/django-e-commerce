# from django.contrib.auth.models import User
import os
import random
from decimal import Decimal

from django.conf import settings
from django.core.files import File
from django.core.management.base import BaseCommand
from faker import Faker

from api.models import Category, Order, OrderItem, Product, User

fake = Faker()


def create_fake_users(num_users):
    # for _ in range(num_users):
    #     username = fake.unique.user_name()
    #     email = fake.unique.email()
    #     password = "fF1aqm18"
    #     role_id, _ = random.choice(User.ROLE_CHOICES)
    #     first_name = fake.first_name()
    #     last_name = fake.last_name()

    #     User.objects.create(
    #         username=username,
    #         email=email,
    #         password=password,
    #         role=role_id,
    #         first_name=first_name,
    #         last_name=last_name
    #     )
    password = "fF1aqm18"

    client = User.objects.create(
        username="client",
        email=fake.unique.email(),
        role=User.CLIENT,
        first_name=fake.first_name(),
        last_name=fake.last_name(),
    )

    seller = User.objects.create(
        username="seller",
        email=fake.unique.email(),
        role=User.SELLER,
        first_name=fake.first_name(),
        last_name=fake.last_name(),
    )

    client.set_password(password)
    seller.set_password(password)

    client.save()
    seller.save()


def create_fake_categories(num_categories):
    for _ in range(num_categories):
        name = fake.unique.word()
        Category.objects.create(name=name)


def create_fake_products(num_products):
    categories = Category.objects.all()
    for _ in range(num_products):
        name = fake.unique.word()
        description = fake.text()
        price = random.uniform(1, 1000)
        category = random.choice(categories)
        quantity = random.randint(1, 100)
        product = Product.objects.create(
            name=name,
            description=description,
            price=price,
            category=category,
            quantity=quantity,
        )
        image_directory = settings.MEDIA_ROOT
        image_filename = random.choice(os.listdir(image_directory))
        image_path = os.path.join(image_directory, image_filename)

        with open(image_path, "rb") as image_file:
            product.image.save(image_filename, File(image_file), save=True)


def create_fake_orders(num_orders, max_items_per_order):
    users = User.objects.all()
    products = Product.objects.all()
    for _ in range(num_orders):
        client = random.choice(users)
        delivery_address = fake.address()
        order = Order.objects.create(client=client, delivery_address=delivery_address)

        total_price = 0
        num_items = random.randint(1, max_items_per_order)
        for _ in range(num_items):
            product = random.choice(products)
            quantity = random.randint(1, 10)
            OrderItem.objects.create(order=order, product=product, quantity=quantity)
            total_price += product.price * quantity

        order.total_price = Decimal(total_price)
        order.save()


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        num_fake_users = 5
        num_fake_categories = 15
        num_fake_products = 100
        num_fake_orders = 50
        max_items_per_order = 10

        create_fake_users(num_fake_users)
        create_fake_categories(num_fake_categories)
        create_fake_products(num_fake_products)
        create_fake_orders(num_fake_orders, max_items_per_order)
