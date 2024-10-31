from accounts.models import CustomUser
from django.db import models

from core.models.team_profile import TeamProfile

class PartType(models.Model):
    name = models.CharField(max_length=50)  # Parça türü adı
    team_profile = models.ForeignKey(TeamProfile, on_delete=models.CASCADE)

    def __str__(self):
        return self.name