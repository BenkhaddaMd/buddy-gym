from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


class Role(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class UserAccountManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)

        user.set_password(password)
        user.save()

        from .models import Role
        membre_role, created = Role.objects.get_or_create(name="Membre")
        user.roles.add(membre_role)

        return user


class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    roles = models.ManyToManyField(Role, related_name="users") 

    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def get_full_name(self):
        return self.first_name

    def get_short_name(self):
        return self.first_name

    def __str__(self):
        return self.email

class Sport(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name
    
class Session(models.Model):
    creator = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='created_sessions')
    sport = models.ForeignKey(Sport, on_delete=models.CASCADE)
    location = models.CharField(max_length=255)
    date = models.DateField()
    time = models.TimeField()
    max_participants = models.IntegerField(default=10)

    def __str__(self):
        return f"{self.sport} on {self.date} at {self.time} - {self.location}"


class Availability(models.Model):
    PERIOD_CHOICES = [
        ('matin', 'Matin'),
        ('soir', 'Soir'),
        ('matin_soir', 'Matin et Soir'),
        ('semaine', 'Semaine'),
        ('tous', 'Tous les jours'),
    ]

    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='availabilities')
    period = models.CharField(max_length=20, choices=PERIOD_CHOICES)


    def __str__(self):
        return f"{self.user.email} - {self.get_period_display()}"


class SportPreference(models.Model):
    user = models.OneToOneField(UserAccount, on_delete=models.CASCADE, related_name='sport_preference')
    preferred_sports = models.ManyToManyField(Sport, blank=True)
    level = models.CharField(max_length=50, choices=[
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    ])
    preferred_time = models.TimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.level}"
    

class Participation(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='participations')
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name='participations')
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'session')

    def __str__(self):
        return f"{self.user.email} - {self.session}"
