from datetime import datetime
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from core.models.part import Part
from core.models.team_profile import TeamProfile
from rest_framework import status
from rest_framework.decorators import api_view
import json
import logging

logger = logging.getLogger(__name__)

@api_view(['GET'])
def get_part(request, part_id):
    try:
        part = Part.objects.get(id=part_id, team_responsible__user=request.user)
        return JsonResponse({"data": {
            "id": part.id,
            "name": part.name,
            "description": part.description,
            "part_type": part.part_type.id,  # Returning ID or part_type.name
            "color": part.color,
            "stock_quantity": part.stock_quantity,
        }}, status=status.HTTP_200_OK)
    except Part.DoesNotExist:
        return JsonResponse({"error": f"Part with ID {part_id} not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error retrieving part: {str(e)}")
        return JsonResponse({"error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def create_part(request):
    try:
        logger.debug(f"Received request body: {request.body.decode('utf-8')}")
        part_data = json.loads(request.body.decode('utf-8'))
        
        part = Part.objects.create(
            team_responsible=TeamProfile.objects.get(user=request.user),
            name=part_data.get("name"),
            description=part_data.get("description"),
            part_type_id=part_data.get("part_type"),
            color=part_data.get("color"),
            stock_quantity=part_data.get("stock_quantity"),
            aircraft_type_id=part_data.get("aircraft_type"),
        )
        return JsonResponse({"message": "Part created successfully", "id": part.id}, status=status.HTTP_201_CREATED)
    except json.JSONDecodeError:
        logger.error("Invalid JSON format.")
        return JsonResponse({"error": "Invalid JSON format."}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Error creating part: {str(e)}")
        return JsonResponse({"error": "Failed to create part."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def update_part(request, part_id):
    try:
        part_data = json.loads(request.body)
        part = Part.objects.get(id=part_id, team_responsible__user=request.user)

        part.name = part_data.get("name", part.name)
        part.description = part_data.get("description", part.description)
        part.part_type_id = part_data.get("part_type", part.part_type.id)  # Ensure using ID
        part.color = part_data.get("color", part.color)
        part.stock_quantity = part_data.get("stock_quantity", part.stock_quantity)
        part.save()

        logger.info(f"Part with ID {part_id} updated successfully.")
        return JsonResponse({"message": "Part updated successfully"}, status=status.HTTP_200_OK)
    except Part.DoesNotExist:
        return JsonResponse({"error": f"Part with ID {part_id} not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error updating part: {str(e)}")
        return JsonResponse({"error": "Failed to update part."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_part(request, part_id):
    try:
        part = Part.objects.get(id=part_id, team_responsible__user=request.user)
        part.delete()
        logger.info(f"Part with ID {part_id} deleted successfully.")
        return JsonResponse({"message": "Part deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except Part.DoesNotExist:
        return JsonResponse({"error": f"Part with ID {part_id} not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error deleting part: {str(e)}")
        return JsonResponse({"error": "Failed to delete part."}, status=status.HTTP_400_BAD_REQUEST)
