from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db.models import Q

from accounts.models import Availability, Sport, SportPreference
from accounts.serializers import AvailabilitySerializer, SportPreferenceSerializer, SportSerializer, UserSerializer


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
            print(request.data)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)