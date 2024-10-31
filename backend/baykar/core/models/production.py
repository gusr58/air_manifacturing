from django.db import models
from core.models.part import Part
from core.models.team_profile import TeamProfile
from core.models.air_craft import Aircraft

class Production(models.Model):
    team = models.ForeignKey(TeamProfile, on_delete=models.CASCADE)  # Hangi takımın ürettiği
    aircraft = models.ForeignKey(Aircraft, on_delete=models.CASCADE)  # Üretilecek uçak
    quantity = models.IntegerField(default=1)  # Üretilen miktar
    created_at = models.DateTimeField(auto_now_add=True)  # Üretim tarihi
    parts = models.ManyToManyField(Part)
    # Parçaları ilişkilendirme
    wings = models.ForeignKey(Part, related_name='productions_wings', on_delete=models.CASCADE, null=True)
    body = models.ForeignKey(Part, related_name='productions_body', on_delete=models.CASCADE, null=True)
    tail = models.ForeignKey(Part, related_name='productions_tail', on_delete=models.CASCADE, null=True)
    avionics = models.ForeignKey(Part, related_name='productions_avionics', on_delete=models.CASCADE, null=True)

    def __str__(self):
        parts_list = [part.name for part in [self.wings, self.body, self.tail, self.avionics] if part is not None]
        return f"{self.quantity} x {', '.join(parts_list)} for {self.aircraft.name} by {self.team.user.email}"

    @property
    def is_complete(self):
        return all([self.wings, self.body, self.tail, self.avionics])  # Tüm parçalar mevcut mu?

    def parts_used(self, user=None):
        # Kullanıcının montaj takımı olup olmadığını kontrol et
        if user and user.teamprofile.role == 'teams-assembly':  # Burada rol kontrolünü kendi yapınıza göre güncelleyebilirsiniz
            return sum(part is not None for part in [self.wings, self.body, self.tail, self.avionics])  # Kullanılan parçaların sayısını döner
        else:
            return 0  # Eğer user verilmezse veya rol uygun değilse 0 döner