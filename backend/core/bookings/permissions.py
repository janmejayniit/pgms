from rest_framework.permissions import BasePermission

class IsTenant(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_tenant


class IsOwnerOrTenant(BasePermission):
    def has_object_permission(self, request, view, obj):
        return (
            obj.tenant == request.user or
            obj.pg.user == request.user
        )
