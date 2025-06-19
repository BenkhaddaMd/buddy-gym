from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db.models import Q

from accounts.models import Sport, SportPreference
from accounts.serializers import SportSerializer
from matching.models import Participation, Session
from matching.serializers import MatchedUserSerializer, ParticipationSerializer, SessionCreateSerializer, SessionSerializer

class SportListView(generics.ListAPIView):
    queryset = Sport.objects.all()
    serializer_class = SportSerializer


class SessionListCreateView(generics.ListCreateAPIView):
    queryset = Session.objects.all().order_by('date', 'time')
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return SessionCreateSerializer
        return SessionSerializer

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


class MatchUsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        try:
            user_pref = user.sport_preference
        except SportPreference.DoesNotExist:
            return Response({"detail": "Sport preferences not set."}, status=400)

        user_sports = user_pref.preferred_sports.all()
        user_periods = user.availabilities.values_list('period', flat=True)

        matched_users = SportPreference.objects.filter(
            ~Q(user=user),
            level=user_pref.level,
            preferred_sports__in=user_sports
        ).distinct()

        if user_periods:
            matched_users = matched_users.filter(
                user__availabilities__period__in=user_periods
            ).distinct()

        serializer = MatchedUserSerializer(matched_users, many=True)
        return Response(serializer.data)
    

class ParticipateToSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, session_id):
        user = request.user
        try:
            session = Session.objects.get(id=session_id)
        except Session.DoesNotExist:
            return Response({"detail": "Session not found."}, status=status.HTTP_404_NOT_FOUND)

        if session.participants.count() >= session.max_participants:
            return Response({"detail": "Session is full."}, status=status.HTTP_400_BAD_REQUEST)

        # Ajouter à la relation M2M + enregistrer une participation
        session.participants.add(user)
        Participation.objects.get_or_create(user=user, session=session)
        
        return Response({"detail": "Successfully joined the session."})


class MyParticipationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        participations = request.user.participations.select_related('session__sport').all()
        serializer = ParticipationSerializer(participations, many=True)
        return Response(serializer.data)
