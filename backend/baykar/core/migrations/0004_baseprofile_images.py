# Generated by Django 5.0.1 on 2024-03-14 20:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_alter_education_user_alter_experience_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='baseprofile',
            name='images',
            field=models.FileField(blank=True, null=True, upload_to='images/', verbose_name='Image'),
        ),
    ]