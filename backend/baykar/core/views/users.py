from accounts.models import CustomUser
from configuration.helpers import get_profile_with_user
from django.http import JsonResponse


def get_current_user(request):
    """
    Retrieve and return the data of the currently authenticated user.

    Args:
        request: The HTTP request object containing user information, typically provided by Django.

    Returns:
        JsonResponse: A JsonResponse object containing the current user's data in JSON format,
                      excluding sensitive information such as the password.
    """
    current_user = request.user
    user_data = CustomUser.objects.filter(pk=current_user.pk).values().first()
    if user_data is not None:
        # Remove the password from the user data
        user_data.pop("password", None)
        profile = get_profile_with_user(request.user.id).first()
        if profile is not None:
            user_data["photo"] = profile.photo.name
            response_data = {"data": user_data}

            return JsonResponse(response_data)
    return JsonResponse({"error": "User didnot login"})
