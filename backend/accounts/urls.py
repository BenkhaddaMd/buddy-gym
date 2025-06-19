from django.urls import path
from .views import SportPreferenceView, UserAvailabilityView, UserUpdateView


urlpatterns = [
    path('user/update/', UserUpdateView.as_view(), name='custom-user-update'),
    path('availability/', UserAvailabilityView.as_view(), name='user-availability'),
    path('preference/', SportPreferenceView.as_view(), name='sport-preference'),
]
