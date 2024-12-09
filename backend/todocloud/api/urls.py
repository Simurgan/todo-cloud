from django.urls import path
from .views import LogoutView, SignupView, TodoItemListCreateView, TodoItemDetailView, UserIdentityView, CustomTokenObtainPairView, CustomTokenRefreshView

urlpatterns = [
    path('auth/signup/', SignupView.as_view(), name='signup'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('account/', UserIdentityView.as_view(), name='user-identity'),
    path('todoitems/', TodoItemListCreateView.as_view(), name='todoitem-list-create'),
    path('todoitems/<int:pk>/', TodoItemDetailView.as_view(), name='todoitem-detail'),
]
