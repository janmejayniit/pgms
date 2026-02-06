# from django.contrib import admin

# # Register your models here.
# from django.contrib import admin
# from .models import User

# @admin.register(User)
# class UserAdmin(admin.ModelAdmin):
#     list_display = (
#         'id',
#         'email',
#         'contact_number',
#         'first_name',
#         'last_name',
#         'is_owner',
#         'is_tenant',
#         'is_active',
#     )
#     search_fields = ('email', 'contact_number', 'first_name', 'last_name')
#     list_filter = ('is_owner', 'is_tenant', 'is_active')




from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.forms import ModelForm
from .models import User


class UserCreationForm(ModelForm):
    class Meta:
        model = User
        fields = ('contact_number', 'first_name', 'last_name', 'email')

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password"])
        if commit:
            user.save()
        return user


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    model = User

    list_display = ("contact_number", "first_name", "last_name", "is_staff")
    ordering = ("-id",)

    fieldsets = (
        (None, {"fields": ("contact_number", "password")}),
        ("Personal info", {"fields": ("first_name", "last_name", "email")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Roles", {"fields": ("is_owner", "is_tenant")}),
        ("Important dates", {"fields": ("last_login",)}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("contact_number", "password1", "password2", "first_name", "last_name", "email"),
        }),
    )

    search_fields = ("contact_number", "email")
