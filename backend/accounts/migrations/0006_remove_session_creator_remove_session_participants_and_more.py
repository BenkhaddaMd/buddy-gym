# Generated by Django 4.2.1 on 2025-06-19 10:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_session_participants'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='session',
            name='creator',
        ),
        migrations.RemoveField(
            model_name='session',
            name='participants',
        ),
        migrations.RemoveField(
            model_name='session',
            name='sport',
        ),
        migrations.DeleteModel(
            name='Participation',
        ),
        migrations.DeleteModel(
            name='Session',
        ),
    ]
