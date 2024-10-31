import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from core.models import Part, TeamProfile, Aircraft, AircraftPartUsage

@csrf_exempt
def produce_part(request):
    """
    Takımın parça üretmesi için bir view.
    """
    if request.method == "POST":
        try:
            team = TeamProfile.objects.get(user=request.user)
            part_data = request.POST.dict()
            
            # Takımın kendi sorumluluğunda olmayan bir parça üretip üretmediğini kontrol et
            if part_data['part_type'] not in team.parts.values_list('part_type', flat=True):
                return JsonResponse({"error": "Bu takımın üretemediği bir parça!"}, status=400)
            
            part = Part.objects.create(**part_data, team_responsible=team)
            return JsonResponse({"data": {"part_id": part.id}}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Geçersiz istek."}, status=400)


@csrf_exempt
def list_parts(request):
    """
    Takımın ürettiği parçaları listelemek için bir view.
    """
    if request.method == "GET":
        try:
            team = TeamProfile.objects.get(user=request.user)
            parts = team.parts.all()
            response_data = [{"id": part.id, "name": part.name, "part_type": part.part_type} for part in parts]
            return JsonResponse({"data": response_data}, status=200)

        except TeamProfile.DoesNotExist:
            return JsonResponse({"error": "Takım bulunamadı."}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Geçersiz istek."}, status=400)


@csrf_exempt
def delete_part(request, part_id):
    """
    Takımın bir parçayı geri dönüşüme göndermesi için bir view.
    """
    if request.method == "DELETE":
        try:
            team = TeamProfile.objects.get(user=request.user)
            part = team.parts.get(id=part_id)
            part.delete()
            return JsonResponse({"message": "Parça silindi."}, status=200)
        except TeamProfile.DoesNotExist:
            return JsonResponse({"error": "Takım bulunamadı."}, status=404)
        except Part.DoesNotExist:
            return JsonResponse({"error": "Parça bulunamadı."}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Geçersiz istek."}, status=400)


@csrf_exempt
def assemble_aircraft(request):
    """
    Montaj takımının parçaları birleştirerek bir uçak üretmesi için bir view.
    """
    if request.method == "POST":
        try:
            team = TeamProfile.objects.get(user=request.user)
            aircraft_data = request.POST.dict()
            aircraft = Aircraft.objects.create(**aircraft_data)

            # Uçak için gereken parçaları kontrol et
            required_parts = ['wing', 'fuselage', 'tail', 'avionics']
            for part_type in required_parts:
                part = team.parts.filter(part_type=part_type).first()
                if part:
                    AircraftPartUsage.objects.create(aircraft=aircraft, part=part)
                    part.stock_quantity -= 1
                    part.save()
                else:
                    return JsonResponse({"error": f"{part_type} eksik!"}, status=400)

            return JsonResponse({"message": "Uçak başarıyla üretildi.", "aircraft_id": aircraft.id}, status=201)

        except TeamProfile.DoesNotExist:
            return JsonResponse({"error": "Takım bulunamadı."}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Geçersiz istek."}, status=400)


@csrf_exempt
def list_aircrafts(request):
    """
    Üretilen uçakları listelemek için bir view.
    """
    if request.method == "GET":
        try:
            aircrafts = Aircraft.objects.all()
            response_data = [{"id": aircraft.id, "name": aircraft.name, "description": aircraft.description} for aircraft in aircrafts]
            return JsonResponse({"data": response_data}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Geçersiz istek."}, status=400)
