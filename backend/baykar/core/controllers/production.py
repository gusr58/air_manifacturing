from core.views.production import create_production, list_production, update_production, delete_production
from rest_framework.decorators import api_view

@api_view(["POST"])
def create_production_api(request):
    """
    Create a new production record.

    Returns:
        response: success or error json.
    """
    return create_production(request)

@api_view(["GET"])
def list_production_api(request):
    """
    List all production records.

    Returns:
        response: success or error json.
    """
    return list_production(request)

@api_view(["PUT"])
def update_production_api(request, production_id):
    """
    Update a specific production record.

    Returns:
        response: success or error json.
    """
    return update_production(request, production_id)

@api_view(["DELETE"])
def delete_production_api(request, production_id):
    """
    Delete a specific production record.

    Returns:
        response: success or error json.
    """
    return delete_production(request, production_id)
