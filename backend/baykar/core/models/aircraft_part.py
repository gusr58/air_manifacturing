from django.db import models

from core.models.air_craft import Aircraft
from core.models.part import Part

class AircraftPartUsage(models.Model):
    aircraft = models.ForeignKey(Aircraft, on_delete=models.CASCADE)
    part = models.ForeignKey(Part, on_delete=models.CASCADE)
    used_quantity = models.IntegerField(default=1)  # Kullanılan parça sayısı

    def __str__(self):
        return f"{self.used_quantity} x {self.part.name} for {self.aircraft.name}"
