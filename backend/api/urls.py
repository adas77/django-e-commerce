from django.urls import path
from rest_framework_simplejwt import views as jwt_views

from .views import (
    CreateOrderView,
    OrderStatsView,
    ProductCategoryMixinView,
    ProductMixinView,
)

urlpatterns = [
    path("token/", jwt_views.TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", jwt_views.TokenRefreshView.as_view(), name="token_refresh"),
    path("product/", ProductMixinView.as_view(), name="product"),
    path("product/<int:pk>/", ProductMixinView.as_view(), name="product-detail"),
    path("order/", CreateOrderView.as_view(), name="order"),
    path("order/stats/", OrderStatsView.as_view(), name="order-stats"),
    path(
        "product/category", ProductCategoryMixinView.as_view(), name="product_category"
    ),
]
