from django.db import models
from core.models.team_profile import TeamProfile
from core.models.air_craft import Aircraft

from core.models.part_type import PartType

class Part(models.Model):
    name = models.CharField(max_length=100)  # Parça adı
    part_type = models.ForeignKey(PartType, on_delete=models.CASCADE, related_name='parts')  # Parça türü ile ilişki
    color = models.CharField(max_length=50)  # Parçanın rengi
    stock_quantity = models.IntegerField(default=0)  # Stok miktarı
    aircraft_type = models.ForeignKey(Aircraft, on_delete=models.CASCADE, related_name='parts')  # Hangi uçak için kullanılacağı
    team_responsible = models.ForeignKey(TeamProfile, on_delete=models.CASCADE, related_name='team_parts')  # Takım sorumlu

    created_at = models.DateTimeField(auto_now_add=True)  # Oluşturulma tarihi
    updated_at = models.DateTimeField(auto_now=True)  # Güncellenme tarihi

    def __str__(self):
        return f"{self.name} ({self.part_type.name})"