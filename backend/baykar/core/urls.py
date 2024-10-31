from core.views.part import create_part, delete_part, update_part
from core.controllers.education import create_education_api, delete_education_api, get_education_api, update_education_api
from core.controllers.experience import create_experience_api, delete_experience_api, get_experience_api, update_experience_api
from core.controllers.profile import get_profile_api, get_profile_with_id_api, get_profiles_by_user_role_api, update_profile_api
from core.controllers.users import get_current_user_api
from django.urls import path

# REST API access.
urlpatterns_api = [
    # User rest api
    path("get_current_user", get_current_user_api, name="get_current_user"),
    # Profile
    path("get_profile", get_profile_api, name="get_profile"),
    path("get_profile/<user_id>/", get_profile_with_id_api, name="get_profile_with_id"),
    path("get_profiles_by_user_role/<user_role>/", get_profiles_by_user_role_api, name="get_profiles_by_user_role"),
    path("update_profile", update_profile_api, name="update_profile"),
    # Education
    path("get_education", get_education_api, name="get_education"),
    path("create_education", create_education_api, name="create_education"),
    path("update_education", update_education_api, name="update_education"),
    path("delete_education", delete_education_api, name="delete_education"),
    # Experience
    path("get_experience", get_experience_api, name="get_experience"),
    path("create_experience", create_experience_api, name="create_experience"),
    path("update_experience/<int:experience_id>", update_experience_api, name="update_experience"),
    path("delete_experience/<int:experience_id>/", delete_experience_api, name="delete_experience"),
    #Parts
    path('create_part/', create_part, name='create_part'),
    path('update_part/<int:part_id>/', update_part, name='update_part'),
    path('delete_part/<int:part_id>/', delete_part, name='delete_part'),
    

]
