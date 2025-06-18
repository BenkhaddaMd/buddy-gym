from django.urls import path
from .views import MatchUsersView, MyParticipationsView, ParticipateSessionView, SessionListCreateView, SportPreferenceView, UserAvailabilityView, SportListView, UserUpdateView


urlpatterns = [
    path('user/update/', UserUpdateView.as_view(), name='custom-user-update'),
    path('sessions/', SessionListCreateView.as_view(), name='session-list-create'),
    path('availability/', UserAvailabilityView.as_view(), name='user-availability'),
    path('preference/', SportPreferenceView.as_view(), name='sport-preference'),
    path('matches/', MatchUsersView.as_view(), name='user-matches'),
    path('sports/', SportListView.as_view(), name='sport-list'),
    path('sessions/<int:session_id>/join/', ParticipateSessionView.as_view(), name='participate-session'),
    path('my-participations/', MyParticipationsView.as_view(), name='my-participations'),
]
