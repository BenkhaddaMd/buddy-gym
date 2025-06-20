from rest_framework import serializers
from accounts.models import SportPreference
from accounts.serializers import SportSerializer, UserSerializer
from .models import Participation, Session

class SessionSerializer(serializers.ModelSerializer):
    creator = serializers.SerializerMethodField()
    sport = serializers.CharField(source='sport.name', read_only=True)
    participants = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Session
        fields = ['id', 'creator', 'sport', 'location', 'date', 'time', 'max_participants', 'participants']
    
    def get_creator(self, obj):
        return f"{obj.creator.first_name} {obj.creator.last_name}"

class SessionCreateSerializer(serializers.ModelSerializer):
    creator = serializers.ReadOnlyField(source='creator.email')

    class Meta:
        model = Session
        fields = ['id', 'creator', 'sport', 'location', 'date', 'time', 'max_participants']


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