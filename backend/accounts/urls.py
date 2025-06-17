# urls.py
from django.urls import path
from .views import UserProfileUpdate

urlpatterns = [
    path('api/user/profile/', UserProfileUpdate.as_view(), name='user-profile-update'),
]
