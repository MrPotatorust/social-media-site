from . import views
from django.urls import path

urlpatterns = [
    path('create_post', views.create_post, name='creates a post'),
    path('read_post/<int:pk>', views.read_post, name='returns one post'),
    path('read_posts', views.read_posts, name='returns first 20 posts'),
    path('register', views.register_user, name='registers the user'),
    path('login', views.login_user, name="logins the user"),
    path('get_new_csrf', views.get_new_csrf, name="gets a csrf token"),
    path('logout', views.logout_user, name="logs out the user")
]
