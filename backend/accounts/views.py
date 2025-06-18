from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Availability, Participation, Session, SportPreference, Sport
from .serializers import AvailabilitySerializer, ParticipationSerializer, SessionSerializer, SportPreferenceSerializer, SportSerializer, UserSerializer
from django.db.models import Q


class UserUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):

        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SportListView(generics.ListAPIView):
    queryset = Sport.objects.all()
    serializer_class = SportSerializer


class SessionListCreateView(generics.ListCreateAPIView):
    queryset = Session.objects.all().order_by('date', 'time')
    serializer_class = SessionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


class UserAvailabilityView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        availabilities = Availability.objects.filter(user=request.user)
        serializer = AvailabilitySerializer(availabilities, many=True)
        return Response(serializer.data)

    def put(self, request):
        # Ici on doit recevoir un id pour modifier une disponibilité précise
        availability_id = request.data.get('id')
        if not availability_id:
            return Response({"detail": "id is required for update."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            availability = Availability.objects.get(id=availability_id, user=request.user)
        except Availability.DoesNotExist:
            return Response({"detail": "Availability not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = AvailabilitySerializer(availability, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        # Création d'une nouvelle disponibilité pour l'utilisateur
        serializer = AvailabilitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class SportPreferenceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        preference, created = SportPreference.objects.get_or_create(user=request.user)
        serializer = SportPreferenceSerializer(preference)
        return Response(serializer.data)

    def put(self, request):
        preference, _ = SportPreference.objects.get_or_create(user=request.user)
        serializer = SportPreferenceSerializer(preference, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MatchUsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        try:
            user_pref = user.sport_preference
        except SportPreference.DoesNotExist:
            return Response({"detail": "Sport preferences not set."}, status=400)

        # Récupérer les sports de l'utilisateur connecté
        user_sports = user_pref.preferred_sports.all()

        # Filtrer les autres utilisateurs qui ont AU MOINS UN sport en commun et le même niveau
        matched_users = SportPreference.objects.filter(
            ~Q(user=user),
            level=user_pref.level,
            preferred_sports__in=user_sports
        ).distinct()

        # Filtrer selon les disponibilités : ici on cherche les utilisateurs qui ont au moins une disponibilité 
        # avec une période identique à une disponibilité de l'utilisateur courant

        user_periods = user.availabilities.values_list('period', flat=True)

        if user_periods:
            matched_users = matched_users.filter(
                user__availabilities__period__in=user_periods
            ).distinct()

        serializer = SportPreferenceSerializer(matched_users, many=True)
        return Response(serializer.data)
    

class ParticipateSessionView(APIView):
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