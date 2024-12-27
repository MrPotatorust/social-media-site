from django.shortcuts import render
from .models import Post, Likes, Saves, Reposts, UserMetaData, PasswordResetToken, EmailAuthToken
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from .serializers import PostSerializer, UserRegisterSerializer, CreatePostSerializer, ProfileSerializer
from django.db.models import Count, Case, When, Value, IntegerField, F, Exists, OuterRef
from django.middleware.csrf import get_token
from datetime import timedelta
from django.utils import timezone
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.contrib.auth.tokens import PasswordResetTokenGenerator

from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token
from rest_framework import generics, status
from rest_framework.response import Response

from .custom_decorator import auth_check
from .custom_functions import send_email

import os
from dotenv import load_dotenv

# Create your views here.

# def token_verification(request):
    
#     try:
#         auth_token = request.COOKIES.get("auth_token")
#         token = Token.objects.get(key=auth_token)
        
#         token_username = token.user.username
#         request_username = request.data['username']

#         if token and token_username == request_username:
#             return True
#         return False
#     except:
#         return False


@api_view(['POST'])
@auth_check
def create_post(request):

    post_data = {
        "text":request.data["text"],
        "author": User.objects.get(username=request.data["username"]).id
    }


    serializer = CreatePostSerializer(data=post_data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def read_post(request, pk):
    queryset = Post.objects.filter(id=pk)
    return Response(PostSerializer(queryset).data)


# ! I have to add exception when the user is not logged in because this will throw an error
@api_view(['GET'])
def read_posts(request, search_query):

    try:
        user = Token.objects.get(key=request.COOKIES.get("auth_token")).user
    except:
        return Response("failed to get an object instance", status=status.HTTP_400_BAD_REQUEST)

    likes = Likes.objects.all().filter(user_id=user, post_id=OuterRef('pk'))
    saves = Saves.objects.all().filter(user_id=user, post_id=OuterRef('pk'))
    reposts = Reposts.objects.all().filter(user_id=user, post_id=OuterRef('pk'))

    base_queryset = Post.objects.annotate(
        likes_count = Count("likes"), 
        saves_count = Count("saves"),
        reposts_count = Count("reposts"),
        liked = Exists(likes),
        saved = Exists(saves),
        reposted = Exists(reposts))

    if search_query != 'null':
        queryset = base_queryset.filter(text__contains = search_query)[0:20]
    else:
        queryset = base_queryset[0:20]
    serializer = PostSerializer(queryset, many=True).data
    return Response(serializer, status=status.HTTP_200_OK)


@api_view(['POST'])
def register_user(request):
    serializer = UserRegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login_user(request):
    username = request.data['username']
    password = request.data['password']

    print(User.objects.get(username=username).is_active)
    user = authenticate(username=username, password=password)
    if user:
        token, created = Token.objects.get_or_create(user=user)
        response = Response(status=status.HTTP_200_OK)
        response.set_cookie(
            key='auth_token', 
            value=token.key,  # Assuming you're using token authentication
            expires=timezone.now() + timedelta(days=30),
            httponly=True,  # Crucial for HTTP-only
            secure=False,    # Only sent over HTTPS
            path="/",
            samesite='strict'  # Prevents CSRF
        )

        return response
    return Response(status=status.HTTP_401_UNAUTHORIZED)

# currently not in use
@api_view(['GET'])
def get_new_csrf(request):
    return Response({
        'csrfToken': get_token(request)
    })


@api_view(['DELETE'])
def logout_user(request):

    auth_token = request.COOKIES.get("auth_token")
    try:
        token_instance = Token.objects.get(key=auth_token)
    except:
        token_instance = None
    if token_instance:
        try:
            response = Response(status=status.HTTP_204_NO_CONTENT)
            response.delete_cookie("auth_token")
            return response
        except:
            response = Response(status=status.HTTP_400_BAD_REQUEST)
            response.delete_cookie("auth_token")
            return response
    
    return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@auth_check
def handle_post_interaction(request):
    
    data = request.data
    data_action = data['action']


    if data_action == 'likes':
        model = Likes
    elif data_action == 'saves':
        model = Saves
    else:
        model = Reposts

    try:
        user = Token.objects.get(key=request.COOKIES.get("auth_token")).user
        post = Post.objects.get(id=data["post_id"])
    except:
        return Response("failed to get an user/post object instance", status=status.HTTP_400_BAD_REQUEST)

    try:
        model.objects.get(user_id=user, post_id=post).delete()
        return Response("changed value to false", status=status.HTTP_200_OK)
    except:
        model.objects.create(user_id=user, post_id=post)
        return Response("changed value to true", status=status.HTTP_200_OK)



@api_view(['GET'])
@auth_check 
def get_profile(request, user):
    try:
        queryset = UserMetaData.objects.select_related(
            "user",
            "country",
            "profile_img",                                           
        ).get(user__username=user)
    except:
        return Response("No profile",status=status.HTTP_200_OK)
    

    if queryset.private == True:
        return Response("Profile is private", status=status.HTTP_200_OK)

    try:
        serializer = ProfileSerializer(queryset).data
    except:
        return Response("Could not serialize", status=status.HTTP_403_FORBIDDEN)
    return Response(serializer, status=status.HTTP_200_OK)

from django.http import FileResponse

@api_view(['GET'])
def get_image(request, media_path):

    base_path = "media"

    # 1 equals video, 2 equals videos
    extensions = {
        'mp4': 1,
        'jpg': 2,
        'jpeg': 2,
        'webp': 2,
        'png': 2,
    }

    if extensions[media_path[-3:]] == 1:
        search_path = f"{base_path}/videos/{media_path}"
    else:
        search_path = f"{base_path}/images/{media_path}"

    return FileResponse(
        open(search_path, 'rb'), 
        content_type='image/jpeg'
    )


@api_view(['POST'])
def test_send_email(request):
    load_dotenv()
    send_mail(
    subject="Subject here",
    message="Here is the message.",
    from_email=os.getenv('DEFAULT_FROM_EMAIL'),
    recipient_list=[os.getenv('DEFAULT_TO_EMAIL')],
    fail_silently=False,
)
    return Response(status=status.HTTP_200_OK)


# ! REWORK THIS make it more readable
# ! REWORK THIS add timeout for new password every 30 minutes, minimum requirements for password 
# found out that token time checking is already implemented in "PasswordResetTokenGenerator"

@api_view(['POST'])
def reset_password_token(request):
    email = request.data.get('email')
    try:
        user = User.objects.get(email=email)
        usermedatadata = UserMetaData.objects.get(user=user)

        # ? dont send a new email for 5 minutes
        if (timezone.now() - usermedatadata.last_reset_email_sent) < timedelta(minutes=5):
            return Response(status=status.HTTP_200_OK)
            # return Response(f'You have to wait {timedelta(minutes=5) - (timezone.now() - usermedatadata.last_reset_email_sent)} minutes before sending another email.',status=status.HTTP_200_OK)

        token_generator = PasswordResetTokenGenerator()
        latest_token = PasswordResetToken.objects.filter(user=user).first()

        # ? if the token is still valid send an email with it
        if latest_token:
            if (timezone.now() - latest_token.created_at) < timedelta(minutes=30) and token_generator.check_token(user, latest_token.token):
                send_email('Password Reset', f"{email}, http://127.0.0.1:5501/frontend/html/password-change.html?token={latest_token.token}")
                return Response(status=status.HTTP_200_OK)
                # return Response('sent another email',status=status.HTTP_200_OK)
        
        # ? if the token is no longer valid create a new one
        generated_token = token_generator.make_token(user)
        new_token = PasswordResetToken(user=user, token=generated_token)
        new_token.save()
        send_email('Password Reset', f"{email}, http://127.0.0.1:5501/frontend/html/password-change.html?token={generated_token}")
    except User.DoesNotExist:
        return Response(status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response('something went wrong', status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(status=status.HTTP_200_OK)

@api_view(['POST'])
def reset_password_submit(request):
    password = request.data.get('password')
    token = request.data.get('token')
    password_reset_object = PasswordResetToken.objects.get(token=token)
    user = password_reset_object.user
    token_generator = PasswordResetTokenGenerator()

    # ? if the the token is more than 30 minutes old its invalid (< is reversed)
    if (timezone.now() - password_reset_object.created_at) > timedelta(minutes=30) or token_generator.check_token(user, token) == False:
        return Response('The link is no longer valid', status=status.HTTP_400_BAD_REQUEST)
    if token_generator.check_token(user, token):
        user.set_password(password)
        user.save()
    return Response(status=status.HTTP_200_OK)

# ! REWORK this token generation is very flawed because it generates very simple tokens, rework should resemble django "PasswordResetTokenGenerator"

@api_view(['POST'])
def reset_password_link_validity(request):
    token = request.data.get('token')
    token_generator = PasswordResetTokenGenerator()

    try:
        password_reset_object = PasswordResetToken.objects.get(token=token)
        user = password_reset_object.user
        if (timezone.now() - password_reset_object.created_at) > timedelta(minutes=30) or token_generator.check_token(user, token) == False:
            return Response('The link is no longer valid', status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response('The link is no longer valid', status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_200_OK)

@auth_check
@api_view(['POST'])
def send_email_verification(request):
    try:
        user = Token.objects.get(key=request.COOKIES.get("auth_token")).user

        new_token = get_random_string(32)

        #if this is true it will throw an error because the token already exists, so it prevents duplicate tokens
        EmailAuthToken.objects.get(new_token)


        send_email('email verification', f'click this link to get verified: http://127.0.0.1:5501/frontend/html/email-verification.html?token={new_token}')

        return Response(status=status.HTTP_200_OK)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
def email_link_validity(request):
    token = request.data.get('token')
    return Response(status=status.HTTP_200_OK)



# ! IF THE TOKEN IS INVALID THE LOGOUT HANDLING IS ON THE FRONTEND
@api_view(['POST'])
@auth_check
def token_check(request):
    return Response(status=status.HTTP_202_ACCEPTED)
