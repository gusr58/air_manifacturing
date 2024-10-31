from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from core.models import Aircraft

@csrf_exempt
def create_aircraft(request):
    """
    Yeni bir uçak oluşturur.
    """
    if request.method == "POST":
        try:
            aircraft_data = request.POST.dict()
            aircraft = Aircraft.objects.create(**aircraft_data)
            return JsonResponse({"data": {"aircraft_id": aircraft.id}}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    
    return JsonResponse({"error": "Geçersiz istek."}, status=400)


@csrf_exempt
def list_aircraft(request):
    """
    Tüm uçakları listeler.
    """
    if request.method == "GET":
        try:
            aircrafts = Aircraft.objects.all()
            response_data = [
                {"id": aircraft.id, "name": aircraft.name, "description": aircraft.description}
                for aircraft in aircrafts
            ]
            return JsonResponse({"data": response_data}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Geçersiz istek."}, status=400)


@csrf_exempt
def update_aircraft(request, aircraft_id):
    """
    Belirtilen uçağı günceller.
    """
    if request.method == "PUT":
        try:
            aircraft = Aircraft.objects.get(id=aircraft_id)
            aircraft_data = request.POST.dict()

            for key, value in aircraft_data.items():
                setattr(aircraft, key, value)

            aircraft.save()
            return JsonResponse({"message": "Uçak başarıyla güncellendi."}, status=200)

        except Aircraft.DoesNotExist:
            return JsonResponse({"error": "Uçak bulunamadı."}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Geçersiz istek."}, status=400)


@csrf_exempt
def delete_aircraft(request, aircraft_id):
    """
    Belirtilen uçağı siler.
    """
    if request.method == "DELETE":
        try:
            aircraft = Aircraft.objects.get(id=aircraft_id)
            aircraft.delete()
            return JsonResponse({"message": "Uçak silindi."}, status=200)

        except Aircraft.DoesNotExist:
            return JsonResponse({"error": "Uçak bulunamadı."}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Geçersiz istek."}, status=400)
