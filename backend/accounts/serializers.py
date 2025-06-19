from djoser.serializers import UserCreateSerializer
from djoser.serializers import UserSerializer as BaseUserSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Availability, Participation, Session, SportPreference, Sport

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
    creator = serializers.SerializerMethodField()
    sport = serializers.StringRelatedField()
    
    class Meta:
        model = Session
        fields = ['id', 'creator', 'sport', 'location', 'date', 'time', 'max_participants']
    
    def get_creator(self, obj):
        return f"{obj.creator.first_name} {obj.creator.last_name}"

class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Availability
        fields = ['id', 'user', 'period']
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

class ParticipationSerializer(serializers.ModelSerializer):
    session = serializers.StringRelatedField()

    class Meta:
        model = Participation
        fields = ['id', 'session', 'joined_at']


class MatchedUserSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    preferred_sports = SportSerializer(many=True)

    class Meta:
        model = SportPreference
        fields = ['user', 'level', 'preferred_sports']

    def get_user(self, obj):
        return {
            "id": obj.user.id,
            "first_name": obj.user.first_name,
            "last_name": obj.user.last_name,
            "email": obj.user.email
        }