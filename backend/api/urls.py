from . import views
from django.urls import path

urlpatterns = [
    path('create-post', views.create_post, name='creates a post'),
    path('read-post/<int:pk>', views.read_post, name='returns one post'),
    path('read-posts/<str:search_query>', views.read_posts, name='returns first 20 posts'),
    path('register', views.register_user, name='registers the user'),
    path('login', views.login_user, name="logins the user"),
    path('get-new-csrf', views.get_new_csrf, name="gets a csrf token"),
    path('logout', views.logout_user, name="logs out the user"),
    path('token-check', views.token_check, name="checks if the auth token is valid"),
    path('handle-post-interaction', views.handle_post_interaction, name="handles, likes, saves, reposts"),
    path('get-profile/<str:user>', views.get_profile, name="returns a user profile"),
    path('get-image/<str:media_path>', views.get_image, name="gets an image from a database"),
    path('test-send-email', views.send_email, name="testing endpoint for sending emails"),
    path('reset-password', views.reset_password_token, name="creates the password reset link"),
    path('submit-password', views.reset_password_submit, name="changes the password"),
    path('reset-password-link-validity', views.reset_password_link_validity, name="checks the validity of a link")
]
