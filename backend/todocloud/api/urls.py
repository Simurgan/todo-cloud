from django.urls import path
from .views import LoginView, LogoutView, SignupView, TodoItemListCreateView, TodoItemDetailView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('todoitems/', TodoItemListCreateView.as_view(), name='todoitem-list-create'),
    path('todoitems/<int:pk>/', TodoItemDetailView.as_view(), name='todoitem-detail'),
]
