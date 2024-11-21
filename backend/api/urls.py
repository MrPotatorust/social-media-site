from . import views
from django.urls import path

urlpatterns = [
    path('create_post', views.create_post, name='blog_creation'),
    path('read_post/<int:pk>', views.read_post, name='read_post'),
    path('read_posts', views.read_posts, name='read_posts'),
    path('register', views.register_user, name='register_user'),
    path('login', views.login_user, name="login_user")
]
