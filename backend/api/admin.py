from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin

from .models import Post
from .models import UserMetaData

# Register your models here.

# class PostAdmin(admin.ModelAdmin):
#     list_display=['title', 'text', 'pub_date', 'likes', 'reposts', 'saves', 'author']
#     list

admin.site.unregister(User)

class UserMetadataInline(admin.StackedInline):
    model = UserMetaData

class CustomUserAdmin(UserAdmin):
    inlines = [UserMetadataInline]

admin.site.register(User, CustomUserAdmin)
admin.site.register(Post)