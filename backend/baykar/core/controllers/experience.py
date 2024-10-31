from core.views.experience import create_experience, delete_experience, get_experience, update_experience
from rest_framework.decorators import api_view


@api_view(["GET"])
def get_experience_api(request):
    """Retrieve the first experience entry for the current user."""
    return get_experience(request)


@api_view(["POST"])
def create_experience_api(request):
    """Create a new experience entry for the current user."""
    return create_experience(request)


@api_view(["POST"])
def update_experience_api(request,experience_id):
    """Update an existing experience."""
    return update_experience(request,experience_id)


@api_view(["DELETE"])
def delete_experience_api(request, experience_id):
    """Delete an experience entry based on its ID."""
    return delete_experience(request, experience_id)

