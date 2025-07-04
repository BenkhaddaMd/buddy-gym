# Generated by Django 4.2.1 on 2025-06-18 14:06

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_role_remove_useraccount_is_staff_useraccount_roles'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='availability',
            name='available_from',
        ),
        migrations.RemoveField(
            model_name='availability',
            name='available_to',
        ),
        migrations.RemoveField(
            model_name='availability',
            name='is_available',
        ),
        migrations.AddField(
            model_name='availability',
            name='period',
            field=models.CharField(choices=[('matin', 'Matin'), ('soir', 'Soir'), ('matin_soir', 'Matin et Soir'), ('semaine', 'Semaine'), ('tous', 'Tous les jours')], default='matin', max_length=20),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='availability',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='availabilities', to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='Participation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('joined_at', models.DateTimeField(auto_now_add=True)),
                ('session', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='participations', to='accounts.session')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='participations', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'session')},
            },
        ),
    ]
