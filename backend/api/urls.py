from . import views
from django.urls import path

urlpatterns = [
    path('create-post', views.create_post, name='creates a post'),
    path('get-post/<int:pk>', views.get_post, name='returns one post'),
    path('get-posts/<str:search_query>', views.get_posts, name='returns first 20 posts'),
    path('register', views.register_user, name='registers the user'),
    path('login', views.login_user, name="logins the user"),
    path('get-new-csrf', views.get_new_csrf, name="gets a csrf token"),
    path('logout', views.logout_user, name="logs out the user"),
    path('token-check', views.token_check, name="checks if the auth token is valid"),
    path('handle-post-interaction', views.handle_post_interaction, name="handles, likes, saves, reposts"),
    path('get-profile/<str:user>', views.get_profile, name="returns a user profile"),
    path('get-image/<str:media_path>', views.get_image, name="gets an image from a database"),
    path('test-send-email', views.send_email, name="testing endpoint for sending emails"),
    path('send-reset-password', views.send_reset_password_token, name="creates the password reset link"),
    path('submit-password', views.reset_password_submit, name="changes the password"),
    path('reset-password-link-validity', views.reset_password_link_validity, name="checks the validity of a link"),
    path('send-email-verification', views.send_email_verification, name="sends email verification"),
    path('email-verification-link-validity', views.email_link_validity, name="checks if the token is valid"),
    path('get-trending-hashtags', views.get_trenging_hashtags, name="returns the trending hashtags"),
    path('get-comments/<int:post_id>', views.get_comments, name="returns the comments for a post")
]
