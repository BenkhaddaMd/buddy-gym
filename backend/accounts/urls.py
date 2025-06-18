from django.urls import path
from .views import JoinSessionView, MatchUsersView, SessionListCreateView, SportPreferenceView, UserAvailabilityView, UserUpdateView


urlpatterns = [
    path('user/update/', UserUpdateView.as_view(), name='custom-user-update'),
    path('sessions/', SessionListCreateView.as_view(), name='session-list-create'),
    path('sessions/<int:pk>/join/', JoinSessionView.as_view(), name='join-session'),
    path('availability/', UserAvailabilityView.as_view(), name='user-availability'),
    path('preference/', SportPreferenceView.as_view(), name='sport-preference'),
    path('matches/', MatchUsersView.as_view(), name='user-matches'),
]
