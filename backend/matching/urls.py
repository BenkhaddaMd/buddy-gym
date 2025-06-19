from django.urls import path
from .views import MatchUsersView, MyParticipationsView, ParticipateToSessionView, SessionListCreateView, SportListView


urlpatterns = [
    path('sessions/', SessionListCreateView.as_view(), name='session-list-create'),
    path('matches/', MatchUsersView.as_view(), name='user-matches'),
    path('sports/', SportListView.as_view(), name='sport-list'),
    path('sessions/<int:session_id>/join/', ParticipateToSessionView.as_view(), name='participate-session'),
    path('my-participations/', MyParticipationsView.as_view(), name='my-participations'),
]
