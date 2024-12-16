# Generated by Django 5.1.3 on 2024-12-16 16:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_usermetadata_country_usermetadata_description_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='title',
        ),
        migrations.AlterField(
            model_name='image',
            name='file_path',
            field=models.CharField(default='default_image.jpg', max_length=255, unique=True),
        ),
    ]