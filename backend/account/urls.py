from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView, TokenBlacklistView
from .views import *
from django.urls import path
from .views.user_info_views import RegisterView, ProfileView, ProfileEditView
from .views.notification_views import HostNotificationView, TenentNotificationView, HostNotificationDeleteView, TenentNotificationDeleteView
from .views.user_info_views import UsernameByIdView

app_name = 'account'
urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('token/blacklist/', TokenBlacklistView.as_view(), name='blacklist'),
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/view/', ProfileView.as_view(), name='profile'),
    path('profile/edit/', ProfileEditView.as_view(), name='profile_edit'),
    path('notifications/host/', HostNotificationView.as_view(), name='host_notifications'),
    path('notifications/tenant/', TenentNotificationView.as_view(), name='tenant_notifications'),
    path('notifications/host/delete/', HostNotificationDeleteView.as_view(), name='host_notifications_delete'),
    path('notifications/tenant/delete/', TenentNotificationDeleteView.as_view(), name='tenant_notifications_delete'),
    path('username/<int:pk>/', UsernameByIdView.as_view(), name='username_by_id'),
]
