from django.apps import AppConfig
from django.db.models.signals import post_migrate
from django.db import connection

class AccountsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "accounts"

    def ready(self):
        from .models import Sport, Role
        from django.db.utils import OperationalError

        def create_initial_sports(sender, **kwargs):
            try:
                if connection.introspection.table_names():
                    sports = ["Football", "Musculation", "Yoga", "Running", "Boxe", "Tennis", "Natation", "Cyclisme", "Escalade", "Danse"]
                    for name in sports:
                        Sport.objects.get_or_create(name=name)
            except OperationalError:
                pass
            
        def create_initial_roles(sender, **kwargs):
            for name in ["Admin", "Coach", "Membre"]:
                Role.objects.get_or_create(name=name)

        post_migrate.connect(create_initial_roles, sender=self)
        post_migrate.connect(create_initial_sports, sender=self)
        pass