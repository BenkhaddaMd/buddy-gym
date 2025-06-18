from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


class UserAccountManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)

        user.set_password(password)
        user.save()

        return user


class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False) # a retirer ; utilisation d'une table ROLES

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
    participants = models.ManyToManyField(UserAccount, related_name='joined_sessions', blank=True)
    max_participants = models.IntegerField(default=10)

    def __str__(self):
        return f"{self.sport} on {self.date} at {self.time} - {self.location}"


class Availability(models.Model):
    user = models.OneToOneField(UserAccount, on_delete=models.CASCADE, related_name='availability')
    is_available = models.BooleanField(default=False)
    available_from = models.TimeField(null=True, blank=True) # matin ou soir
    available_to = models.TimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {'Available' if self.is_available else 'Unavailable'}"


class SportPreference(models.Model):
    user = models.OneToOneField(UserAccount, on_delete=models.CASCADE, related_name='sport_preference')
    preferred_sports = models.JSONField(default=list)
    level = models.CharField(max_length=50, choices=[
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    ])
    preferred_time = models.TimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.level}"