from core.views.part import create_part, list_parts, update_part, delete_part
from rest_framework.decorators import api_view

@api_view(["POST"])
def create_part_api(request):
    """
    Create a new part.

    Returns:
        response: success or error json.
    """
    return create_part(request)

@api_view(["GET"])
def list_parts_api(request):
    """
    List all parts.

    Returns:
        response: success or error json.
    """
    return list_parts(request)

@api_view(["PUT"])
def update_part_api(request, part_id):
    """
    Update a specific part.

    Returns:
        response: success or error json.
    """
    return update_part(request, part_id)

@api_view(["DELETE"])
def delete_part_api(request, part_id):
    """
    Delete a specific part.

    Returns:
        response: success or error json.
    """
    return delete_part(request, part_id)
