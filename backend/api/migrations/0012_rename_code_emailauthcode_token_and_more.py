# Generated by Django 5.1.3 on 2024-12-20 21:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_emailauthcode_passwordresetcode'),
    ]

    operations = [
        migrations.RenameField(
            model_name='emailauthcode',
            old_name='code',
            new_name='token',
        ),
        migrations.RenameField(
            model_name='passwordresetcode',
            old_name='code',
            new_name='token',
        ),
    ]
