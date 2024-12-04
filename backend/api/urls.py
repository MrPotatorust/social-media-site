from . import views
from django.urls import path

urlpatterns = [
    path('create-post', views.create_post, name='creates a post'),
    path('read-post/<int:pk>', views.read_post, name='returns one post'),
    path('read-posts', views.read_posts, name='returns first 20 posts'),
    path('register', views.register_user, name='registers the user'),
    path('login', views.login_user, name="logins the user"),
    path('get-new-csrf', views.get_new_csrf, name="gets a csrf token"),
    path('logout', views.logout_user, name="logs out the user"),
    path('token-check', views.token_check, name="checks if the auth token is valid"),
    path('handle-post-interaction', views.handle_post_interaction, name="handles, likes, saves, reposts")
]
