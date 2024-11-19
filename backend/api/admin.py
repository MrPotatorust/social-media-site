from django.contrib import admin

from .models import Post

# Register your models here.

# class PostAdmin(admin.ModelAdmin):
#     list_display=['title', 'text', 'pub_date', 'likes', 'reposts', 'saves', 'author']
#     list

admin.site.register(Post)