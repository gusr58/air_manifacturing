from core.models.base_profile import BaseProfile
from django.db import models


class ArtistProfile(BaseProfile):
    body_size = models.CharField("Body Size", max_length=200, blank=True, null=True)
    length = models.FloatField("Length", blank=True, null=True)
    weight = models.FloatField("Weight", blank=True, null=True)
    eye_color = models.CharField("Eye Color", max_length=200, blank=True, null=True)
    skin_color = models.CharField("Skin Color", max_length=200, blank=True, null=True)

    def __str__(self):
        return f"{self.user.email}'s Profile"
