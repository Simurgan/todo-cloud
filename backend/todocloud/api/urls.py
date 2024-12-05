from django.urls import path
from .views import TodoItemListCreateView, TodoItemDetailView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('todoitems/', TodoItemListCreateView.as_view(), name='todoitem-list-create'),
    path('todoitems/<int:pk>/', TodoItemDetailView.as_view(), name='todoitem-detail'),
]
