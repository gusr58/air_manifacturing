from core.models import (
    ArtistProfile, 
    Education, 
    Experience, 
    TeamProfile, 
    Part, 
    Aircraft, 
    Production,
    PartType
)
from django.contrib import admin


class ArtistProfileAdmin(admin.ModelAdmin):
    # List Display: Columns you want to display in the admin list view
    list_display = ("user", "birthdate", "agency", "branch")

    # Search Fields: Fields on which you want to enable search functionality
    search_fields = ("user__email", "agency", "branch", "phone")

    # List Filter: Sidebar filters you want to apply
    list_filter = ("gender", "agency", "branch")

    # Fieldsets: Structure the form view
    fieldsets = (
        (None, {"fields": ("user", "birthdate", "phone", "citizen", "photo", "video")}),
        ("Personal Info", {"fields": ("gender", "body_size", "length", "weight", "eye_color", "skin_color")}),
        ("Address Info", {"fields": ("country", "city")}),
        ("Professional Info", {"fields": ("driving_licence", "agency", "branch", "experience", "languages", "references")}),
        ("Social Info", {"fields": ("facebook", "instagram")}),
        ("Others", {"fields": ("introduction",)}),
    )


class TeamProfileAdmin(admin.ModelAdmin):
    # List Display: Columns you want to display in the admin list view
    list_display = ("user", "birthdate", "agency", "branch")

    # Search Fields: Fields on which you want to enable search functionality
    search_fields = ("user__email", "agency", "branch", "phone")

    # List Filter: Sidebar filters you want to apply
    list_filter = ("gender", "agency", "branch")

    # Fieldsets: Structure the form view
    fieldsets = (
        (None, {"fields": ("user", "birthdate", "phone", "citizen", "photo", "video")}),
        ("Address Info", {"fields": ("country", "city")}),
        ("Professional Info", {"fields": ("driving_licence", "agency", "branch", "experience", "languages", "references")}),
        ("Social Info", {"fields": ("facebook", "instagram")}),
        ("Others", {"fields": ("introduction",)}),
    )


class ExperienceAdmin(admin.ModelAdmin):
    list_display = ("user", "title", "company", "city", "country", "start_date", "end_date")
    list_filter = ("start_date", "end_date", "city", "country")
    search_fields = ("title", "company", "description")


class EducationAdmin(admin.ModelAdmin):
    list_display = ("user", "institution_name", "degree", "field_of_study", "city", "country", "start_date", "end_date")
    list_filter = ("start_date", "end_date", "city", "country")
    search_fields = ("institution_name", "degree", "field_of_study", "description")


# Part Admin
class PartAdmin(admin.ModelAdmin):
    list_display = ('name', 'team_responsible', 'created_at', 'updated_at')
    search_fields = ('name',)
    list_filter = ('team_responsible',)

    def save_model(self, request, obj, form, change):
        if change:
            # Güncellemelerde kontrol mekanizması
            if obj.team_responsible != request.user.teamprofile:
                raise Exception("Bu takım başka bir takımın parçasını güncelleyemez.")
        super().save_model(request, obj, form, change)


# Aircraft Admin
class AircraftAdmin(admin.ModelAdmin):
    list_display = ('name', 'model', 'created_at')
    search_fields = ('name', 'model',)

class ProductionAdmin(admin.ModelAdmin):
    list_display = ('aircraft', 'parts_used', 'created_at')
    search_fields = ('aircraft__name',)

    def save_model(self, request, obj, form, change):
        # Uçak üretimi sırasında kontrol mekanizması
        if not all([obj.wings, obj.body, obj.tail, obj.avionics]):  # Tüm parçaların dolu olup olmadığını kontrol et
            raise Exception("Eksik parça var. Lütfen tüm parçaları ekleyin.")

        # Öncelikle objeyi kaydediyoruz
        super().save_model(request, obj, form, change)

        # Bu noktada obj.id mevcut, Many-to-Many ilişkisini burada güncelleyebilirsiniz
        if 'parts' in form.cleaned_data:
            obj.parts.set(form.cleaned_data['parts'])  # parts alanını güncelleyin


class PartTypeAdmin(admin.ModelAdmin):
    list_display = ('name',)  # Görüntülenecek alanlar
    search_fields = ('name',)  # Arama alanları

# Register your models here.
admin.site.register(ArtistProfile, ArtistProfileAdmin)
admin.site.register(TeamProfile, TeamProfileAdmin)
admin.site.register(Experience, ExperienceAdmin)
admin.site.register(Education, EducationAdmin)
admin.site.register(Part, PartAdmin)
admin.site.register(Aircraft, AircraftAdmin)
admin.site.register(Production, ProductionAdmin)
admin.site.register(PartType, PartTypeAdmin)  
