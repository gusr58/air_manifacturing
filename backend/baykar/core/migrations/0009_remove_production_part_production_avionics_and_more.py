# Generated by Django 5.0.1 on 2024-10-30 20:19

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0008_alter_aircraft_required_parts_count_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="production",
            name="part",
        ),
        migrations.AddField(
            model_name="production",
            name="avionics",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="productions_avionics",
                to="core.part",
            ),
        ),
        migrations.AddField(
            model_name="production",
            name="body",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="productions_body",
                to="core.part",
            ),
        ),
        migrations.AddField(
            model_name="production",
            name="tail",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="productions_tail",
                to="core.part",
            ),
        ),
        migrations.AddField(
            model_name="production",
            name="wings",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="productions_wings",
                to="core.part",
            ),
        ),
    ]
