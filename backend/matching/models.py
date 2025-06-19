from django.db import models
from accounts.models import Sport, UserAccount

    
class Session(models.Model):
    creator = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='created_sessions')
    sport = models.ForeignKey(Sport, on_delete=models.CASCADE)
    location = models.CharField(max_length=255)
    date = models.DateField()
    time = models.TimeField()
    max_participants = models.IntegerField(default=10)
    participants = models.ManyToManyField(UserAccount, through='Participation', related_name='sessions_participated')

    def __str__(self):
        return f"{self.sport} on {self.date} at {self.time} - {self.location}"


class Participation(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='participations')
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name='participations')
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'session')

    def __str__(self):
        return f"{self.user.email} - {self.session}"
