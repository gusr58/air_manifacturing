from rest_framework.response import Response
from rest_framework import status
from core.models.production import Production
from core.models.part import Part
from core.models.team_profile import TeamProfile

def create_production(request):
    """Create a new production record."""
    try:
        team_id = request.data.get("team_id")
        part_id = request.data.get("part_id")
        quantity = request.data.get("quantity", 1)

        team = TeamProfile.objects.get(id=team_id)
        part = Part.objects.get(id=part_id)

        # Ensure the team can produce this part
        if part.team_responsible != team:
            return Response({"error": "This team cannot produce the specified part."}, status=status.HTTP_403_FORBIDDEN)

        production = Production.objects.create(team=team, part=part, quantity=quantity)
        return Response({"id": production.id, "message": "Production created successfully."}, status=status.HTTP_201_CREATED)

    except TeamProfile.DoesNotExist:
        return Response({"error": "Team not found."}, status=status.HTTP_404_NOT_FOUND)
    except Part.DoesNotExist:
        return Response({"error": "Part not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

def list_production(request):
    """List all production records."""
    productions = Production.objects.all().values()
    return Response({"data": list(productions)}, status=status.HTTP_200_OK)

def update_production(request, production_id):
    """Update a specific production record."""
    try:
        production = Production.objects.get(id=production_id)
        production.quantity = request.data.get("quantity", production.quantity)
        production.save()
        return Response({"message": "Production updated successfully."}, status=status.HTTP_200_OK)
    
    except Production.DoesNotExist:
        return Response({"error": "Production not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

def delete_production(request, production_id):
    """Delete a specific production record."""
    try:
        production = Production.objects.get(id=production_id)
        production.delete()
        return Response({"message": "Production deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    
    except Production.DoesNotExist:
        return Response({"error": "Production not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
