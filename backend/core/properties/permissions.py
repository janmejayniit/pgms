from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsOwner(BasePermission):
    """
    Allow only property owner to modify
    """
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class IsTenant(BasePermission):
    """
    Allow only tenant users
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_tenant


class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.user == request.user
