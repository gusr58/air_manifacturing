# Generated by Django 5.0.1 on 2024-10-30 20:47

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0009_remove_production_part_production_avionics_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="production",
            name="parts",
            field=models.ManyToManyField(to="core.part"),
        ),
    ]
