from core.views.aircraft import create_aircraft, list_aircraft, update_aircraft, delete_aircraft
from rest_framework.decorators import api_view

@api_view(["POST"])
def create_aircraft_api(request):
    """
    Create a new aircraft.

    Returns:
        response: success or error json.
    """
    return create_aircraft(request)

@api_view(["GET"])
def list_aircraft_api(request):
    """
    List all aircraft.

    Returns:
        response: success or error json.
    """
    return list_aircraft(request)

@api_view(["PUT"])
def update_aircraft_api(request, aircraft_id):
    """
    Update a specific aircraft.

    Returns:
        response: success or error json.
    """
    return update_aircraft(request, aircraft_id)

@api_view(["DELETE"])
def delete_aircraft_api(request, aircraft_id):
    """
    Delete a specific aircraft.

    Returns:
        response: success or error json.
    """
    return delete_aircraft(request, aircraft_id)
