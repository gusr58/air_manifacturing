from django.db import models

class Aircraft(models.Model):
    name = models.CharField(max_length=100)  # Uçak adı
    description = models.TextField(blank=True, null=True)  # Uçak açıklaması
    created_at = models.DateTimeField(auto_now_add=True)  # Oluşturulma tarihi
    updated_at = models.DateTimeField(auto_now=True)  # Güncellenme tarihi
    required_parts_count = models.PositiveIntegerField(default=0)  # Gerekli parça sayısı

    def __str__(self):
        return self.name
