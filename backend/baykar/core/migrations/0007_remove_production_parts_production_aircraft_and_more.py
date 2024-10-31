# Generated by Django 5.0.1 on 2024-10-30 15:00
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0006_remove_production_part_production_parts"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="production",
            name="parts",
        ),
        migrations.AddField(
            model_name="production",
            name="aircraft",
            field=models.ForeignKey(
                null=True,  # İsterseniz bu satırı kaldırabilirsiniz, bu durumda null değer kabul etmez.
                on_delete=django.db.models.deletion.CASCADE,
                to="core.aircraft",
            ),
        ),
        migrations.AddField(
            model_name="production",
            name="part",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="core.part",
            ),
        ),
    ]