from core.views.aircraft import create_usage, list_usages, update_usage, delete_usage
from core.models.aircraft_part import AircraftPartUsage  # Doğru import
from rest_framework.decorators import api_view

@api_view(["POST"])
def create_usage_api(request):
    """
    Create a new aircraft part usage record.

    Returns:
        response: success or error json.
    """
    return create_usage(request)

@api_view(["GET"])
def list_usages_api(request):
    """
    List all aircraft part usage records.

    Returns:
        response: success or error json.
    """
    return list_usages(request)

@api_view(["PUT"])
def update_usage_api(request, usage_id):
    """
    Update a specific aircraft part usage record.

    Returns:
        response: success or error json.
    """
    return update_usage(request, usage_id)

@api_view(["DELETE"])
def delete_usage_api(request, usage_id):
    """
    Delete a specific aircraft part usage record.

    Returns:
        response: success or error json.
    """
    return delete_usage(request, usage_id)
