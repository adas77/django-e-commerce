from django.urls import path
from rest_framework_simplejwt import views as jwt_views

from .views import ProductCategoryMixinView, ProductMixinView

urlpatterns = [
    path("token/", jwt_views.TokenObtainPairView.as_view(),
         name="token_obtain_pair"),
    path("token/refresh/", jwt_views.TokenRefreshView.as_view(), name="token_refresh"),

    path("product/", ProductMixinView.as_view(), name="product"),
    path("product/category", ProductCategoryMixinView.as_view(),
         name="product_category"),
]
