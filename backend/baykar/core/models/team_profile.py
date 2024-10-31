from core.models.base_profile import BaseProfile
from django.db import models

class TeamProfile(BaseProfile):
    equipment = models.JSONField("Equipment", blank=True, null=True)
    parts = models.ManyToManyField('core.Part', related_name='teams', blank=True)

    def __str__(self):
        return f"{self.user.email}'s Team Profile"

    def produce_part(self, part_data):
        """Takımın parça üretmesi için bir metot"""
        from core.models.part import Part
        
        # Takımın parça türünü alıyoruz
        part_type = self.part_type

        # Parça verisini güncelleyerek yeni parça oluşturuyoruz
        part = Part(**part_data, part_type=part_type, team_responsible=self)
        part.save()
        self.parts.add(part)  # Takıma parçayı ekle
        return part

    def delete_part(self, part_id):
        """Takımın parçayı geri dönüşüme göndermesi için bir metot"""
        part = self.parts.get(id=part_id)
        self.parts.remove(part)
        part.delete()

    def list_parts(self):
        """Takımın ürettiği parçaları listele"""
        return self.parts.all()