from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied

class IsAdminUser(BasePermission):
    """
    Custom permission to only allow access to users with an 'admin' role.
    """
    def has_permission(self, request, view):
        # Check if the user is authenticated
        if not request.user.is_authenticated:
            raise PermissionDenied("You must be logged in.")

        # Retrieve the user's role (assuming it's saved in the User model)
        user_role = getattr(request.user, 'user_role', None)  # 'role' can be part of your User model

        # If the user's role is 'admin', they are authorized
        if user_role == 1:
            return True
        else:
            raise PermissionDenied("You do not have permission to access this resource.")
