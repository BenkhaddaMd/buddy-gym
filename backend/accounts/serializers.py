from djoser.serializers import UserCreateSerializer
from djoser.serializers import UserSerializer as BaseUserSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Availability, Session, SportPreference, Sport

User = get_user_model()

class UserSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = ('id', 'email', 'first_name', 'last_name')

class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'password')

class SessionSerializer(serializers.ModelSerializer):
    creator = serializers.ReadOnlyField(source='creator.username')
    participants = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Session
        fields = ['id', 'creator', 'sport', 'location', 'date', 'time', 'participants', 'max_participants']

class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Availability
        fields = ['id', 'user', 'is_available', 'available_from', 'available_to']
        read_only_fields = ['user']


class SportPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = SportPreference
        fields = ['id', 'user', 'preferred_sports', 'level', 'preferred_time']
        read_only_fields = ['user']


class SportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sport
        fields = ['id', 'name']