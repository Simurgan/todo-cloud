# Generated by Django 5.1.4 on 2024-12-08 21:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('database', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='todoitem',
            name='deadline',
        ),
        migrations.RemoveField(
            model_name='todoitem',
            name='description',
        ),
    ]