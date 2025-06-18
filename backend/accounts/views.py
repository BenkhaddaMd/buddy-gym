from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Availability, Session, SportPreference
from .serializers import AvailabilitySerializer, SessionSerializer, SportPreferenceSerializer, UserSerializer

class UserUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        print("🔐 Authenticated user:", request.user)
        print("📦 Incoming data:", request.data)

        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            user = serializer.save()
            print("✅ User updated:", user)
            return Response(serializer.data)
        
        print("❌ Validation errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SessionListCreateView(generics.ListCreateAPIView):
    queryset = Session.objects.all().order_by('date', 'time')
    serializer_class = SessionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

class JoinSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            session = Session.objects.get(pk=pk)
        except Session.DoesNotExist:
            return Response({'detail': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)

        if request.user in session.participants.all():
            return Response({'detail': 'Already joined'}, status=400)

        if session.participants.count() >= session.max_participants:
            return Response({'detail': 'Session is full'}, status=400)

        session.participants.add(request.user)
        return Response({'detail': 'Joined session'})

class UserAvailabilityView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        availability, created = Availability.objects.get_or_create(user=request.user)
        serializer = AvailabilitySerializer(availability)
        return Response(serializer.data)

    def put(self, request):
        availability, _ = Availability.objects.get_or_create(user=request.user)
        serializer = AvailabilitySerializer(availability, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
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

        # Get all other users with at least one matching sport and same level
        matched_users = SportPreference.objects.filter(
            ~Q(user=user),  # exclude self
            level=user_pref.level,
            preferred_sports__overlap=user_pref.preferred_sports  # for PostgreSQL JSONField
        )

        # Optional: filter with availability matching (simple version)
        try:
            user_availability = user.availability
            matched_users = matched_users.filter(
                user__availability__is_available=True,
            )
        except Availability.DoesNotExist:
            pass  # Skip availability filtering if user has none

        # Serialize
        serializer = SportPreferenceSerializer(matched_users, many=True)
        return Response(serializer.data)
