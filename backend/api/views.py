from django.shortcuts import render
from .models import CustomUser, Post, Like, Save, Comment, Repost, Dislike, UserMetaData, PasswordResetToken, EmailAuthToken, Hashtag, PostHashtag
from django.contrib.auth import authenticate, login, password_validation
from django.contrib.auth.models import User
from .serializers import LoggedOutPostSerializer, LoggedInPostSerializer, CreateCommentSerializer, UserRegisterSerializer, CreatePostSerializer, ProfileSerializer, HashtagSerializer
from django.db.models import Count, Case, When, Value, IntegerField, F, Exists, OuterRef
from django.middleware.csrf import get_token
from datetime import timedelta
from django.utils import timezone
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import base36_to_int, int_to_base36
from django.core.cache import cache

from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token
from rest_framework import generics, status
from rest_framework.response import Response
from django.http import FileResponse

from .custom_decorators import auth_check
from .custom_functions import send_email, EmailVerificationTokenGenerator, ResetVerificationTokenManager

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

    hashtags = []
    add_hashtag = False
    temp_hashtag_word = ""

    try:
        text = request.data["text"]
        post_data = {
            "text":text,
            "author": Token.objects.get(key=request.COOKIES.get("auth_token")).user.id,
            "main_post": True
        }

        if request.data["action"] == "comment":
            post_data["main_post"] = False
            serializer = CreateCommentSerializer(data={"post": request.data["commentId"], "comment_post": post_data })
        elif request.data["action"] == "createPost":
            serializer = CreatePostSerializer(data=post_data)
        else:
            return Response("uknown action", status=status.HTTP_400_BAD_REQUEST)


        if serializer.is_valid():
            for char in text:
                if add_hashtag and char == " ":
                    hashtags.append(temp_hashtag_word)
                    temp_hashtag_word = ""
                    add_hashtag = False
                elif add_hashtag:
                    temp_hashtag_word += char
                if char == "#":
                    add_hashtag = True
            

            if temp_hashtag_word:
                hashtags.append(temp_hashtag_word)

            post = serializer.save()

            for hashtag in hashtags[:len(hashtags)]:
                hashtag_model, created = Hashtag.objects.get_or_create(tag=hashtag)
                
                if created == False:
                    hashtag_model.mentions += 1
                    hashtag_model.save()

                PostHashtag.objects.create(post_id=post, hashtag_id=hashtag_model)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        print(serializer.errors)
        return Response("serialization failed", status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_post(request, pk):
    return Response("currently under development", status=status.HTTP_401_UNAUTHORIZED)
    # try:
    #     queryset = Post.objects.filter(id=pk)
    #     return Response(PostSerializer(queryset).data)
    # except:
    #     return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_posts(request, search_query):

    token = Token.objects.filter(key=request.COOKIES.get("auth_token")).first()
    # return Response("failed to get an object instance", status=status.HTTP_400_BAD_REQUEST)

    if token:
        user = token.user
        likes = Like.objects.filter(user_id=user, post_id=OuterRef('pk'))
        saves = Save.objects.filter(user_id=user, post_id=OuterRef('pk'))
        reposts = Repost.objects.filter(user_id=user, post_id=OuterRef('pk'))
        dislikes = Dislike.objects.filter(user_id=user, post_id=OuterRef('pk'))
        base_queryset = Post.objects.annotate(
            like_count = Count("like"), 
            save_count = Count("save"),
            repost_count = Count("repost"),
            dislike_count = Count("dislike"),
            comment_count = Count("original_posts"),
            liked = Exists(likes),
            disliked = Exists(dislikes),
            saved = Exists(saves),
            reposted = Exists(reposts))
        
        current_serializer = LoggedInPostSerializer
        
    else:
        base_queryset = Post.objects.annotate(
            like_count = Count("like"), 
            save_count = Count("save"),
            repost_count = Count("repost"),
            dislike_count = Count("dislike"),
            comment_count = Count("original_posts"))
        
        current_serializer = LoggedOutPostSerializer

    base_queryset = base_queryset.filter(main_post = True).order_by("-pub_date")

    if search_query != '&&null':
        queryset = base_queryset.filter(text__contains = search_query)[:20]
    else:
        queryset = base_queryset[:20]
    serializer = current_serializer(queryset, many=True).data

    return Response(serializer, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_comments(request, post_id):
    
    base_queryset = Post.objects.filter(
    id__in=Comment.objects.filter(post=post_id).values_list("comment_post", flat=True)
    ).annotate(
            like_count = Count("like"), 
            save_count = Count("save"),
            repost_count = Count("repost"),
            dislike_count = Count("dislike"),
            comment_count = Count("original_posts")).order_by("-pub_date")

    serializer = LoggedOutPostSerializer(base_queryset, many=True).data
    return Response(serializer, status=status.HTTP_200_OK)


@api_view(['POST'])
def register_user(request):
    serializer = UserRegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        
        return Response("succesfully registered", status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login_user(request):

    try:
        username = request.data['username']
        password = request.data['password']

        user = authenticate(username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            response = Response(status=status.HTTP_200_OK)
            response.set_cookie(
                key='auth_token', 
                value=token.key,  # Assuming you're using token authentication
                expires=timezone.now() + timedelta(days=30),
                httponly=True,  # Crucial for HTTP-only
                secure=True,    # Only sent over HTTPS
                path="/",
                samesite='none'  # Prevents CSRF
            )

            return response
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    except:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
#? currently not in use
@api_view(['GET'])
def get_new_csrf(request):
    return Response({
        'csrfToken': get_token(request)
    })


@api_view(['DELETE'])
def logout_user(request):

    auth_token = request.COOKIES.get("auth_token")
    try:
        Token.objects.get(key=auth_token)
        response = Response(status=status.HTTP_204_NO_CONTENT)
        response.set_cookie(
                key='auth_token', 
                value="",  # Assuming you're using token authentication
                expires=0,
                httponly=True,  # Crucial for HTTP-only
                secure=True,    # Only sent over HTTPS
                path="/",
                samesite='none'  # Prevents CSRF
            )
        return response
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@auth_check
def handle_post_interaction(request):
    data = request.data
    data_action = data['action']
    
    
    try:
        user = Token.objects.get(key=request.COOKIES.get("auth_token")).user
        post = Post.objects.get(id=data["post_id"])
    except:
        return Response("failed to get an user/post object instance", status=status.HTTP_400_BAD_REQUEST)

    if data_action == 'like':
        model = Like
        if Dislike.objects.filter(user_id=user, post_id=post).first():
            Dislike.objects.get(user_id=user, post_id=post).delete()
    elif data_action == "dislike":
        model = Dislike
        if Like.objects.filter(user_id=user, post_id=post).first():
            Like.objects.get(user_id=user, post_id=post).delete()
    elif data_action == 'save':
        model = Save
    elif data_action == 'repost':
        model = Repost
    else:
        return Response("uknown action", status=status.HTTP_400_BAD_REQUEST)


    
    try:
        model.objects.get(user_id=user, post_id=post).delete()
        return Response("changed value to false", status=status.HTTP_200_OK)
    except:
        model.objects.create(user_id=user, post_id=post)
        return Response("changed value to true", status=status.HTTP_200_OK)



@api_view(['GET'])
# @auth_check 
def get_profile(request, user):
    
    token = Token.objects.filter(key=request.COOKIES.get("auth_token")).first()

    if token is not None:
        request_user = token.user
    else:
        request_user = None

    if user == "&&null" and request_user:
        user = request_user.username


    try:
        queryset = UserMetaData.objects.select_related(
            "user",
            "country",
            "profile_img",                                           
        ).get(user__username=user)
    except:
        return Response({"error": "No profile"},status=status.HTTP_403_FORBIDDEN)

    if queryset.private and request_user != queryset.user:
        return Response({"error": "Profile is private"}, status=status.HTTP_403_FORBIDDEN)

    try:
        serializer = ProfileSerializer(queryset).data
    except:
        return Response({"error": "Could not serializer"}, status=status.HTTP_404_NOT_FOUND)

    if not queryset.is_setup and request_user == queryset.user:
        return Response({"error": "Profile is not setup", "data": serializer}, status=status.HTTP_403_FORBIDDEN)

        
    return Response({"data": serializer}, status=status.HTTP_200_OK)

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

    try:
        return FileResponse(
            open(search_path, 'rb'), 
            content_type='image/jpeg'
        )
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)


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
# ! REWORK THIS add timeout for new password every 30 minutes
# found out that token time checking is already implemented in "PasswordResetTokenGenerator"

@api_view(['POST'])
def send_reset_password_token(request):
    email = request.data.get('email')

    if email:
        try:
            user = CustomUser.objects.get(email=email)
        except:
            return Response(status=status.HTTP_200_OK)
        manager = ResetVerificationTokenManager(PasswordResetTokenGenerator, PasswordResetToken)

        response = manager.send_token(user, "Password Reset", "password-reset.html", 5, 30, True)
        return response
    return Response("no email was provided", status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def reset_password_submit(request):
    password = request.data.get('password')


    token = request.data.get('token')
    password_reset_object = PasswordResetToken.objects.get(token=token)
    user = password_reset_object.user

    try:
        password_validation.validate_password(password, user)
    except Exception as e:
        print(e)
        return Response(e,status=status.HTTP_400_BAD_REQUEST)


    token_generator = PasswordResetTokenGenerator()

    # ? if the the token is more than 30 minutes old its invalid (< is reversed)
    if (timezone.now() - password_reset_object.created_at) > timedelta(minutes=30) or token_generator.check_token(user, token) == False:
        return Response('The link is no longer valid', status=status.HTTP_400_BAD_REQUEST)
    if token_generator.check_token(user, token):
        user.set_password(password)
        user.save()
    return Response("successfully reset password",status=status.HTTP_200_OK)

# ! REWORK this token generation is very flawed because it generates very simple tokens, rework should resemble django "PasswordResetTokenGenerator"

@api_view(['POST'])
def reset_password_link_validity(request):
    try:
        token = request.data.get('token')
        manager = ResetVerificationTokenManager(PasswordResetTokenGenerator, PasswordResetToken)
        if token:
            response = manager.validity(token, 30)
            return response
        return Response(status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#! MAKE SURE valid_time IN manager.send_token() IS THE SAME AS timeout_time IN manager.validity()

@auth_check
@api_view(['POST'])
def send_email_verification(request):

    try:
        user = Token.objects.get(key=request.COOKIES.get("auth_token")).user
        manager = ResetVerificationTokenManager(EmailVerificationTokenGenerator, EmailAuthToken)
        response = manager.send_token(user, "email_verification", "email-verification.html", 5, 30, False)
        return response
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
def email_link_validity(request):
    try:
        token = request.data.get('token')
        manager = ResetVerificationTokenManager(EmailVerificationTokenGenerator, EmailAuthToken)
        response = manager.validity(token, 30) 
        return response
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_trenging_hashtags(request):
    trending_hashtags = Hashtag.objects.order_by("-mentions")[:10]
    serializer = HashtagSerializer(trending_hashtags, many=True).data
    return Response(serializer, status=status.HTTP_200_OK)


# ! IF THE TOKEN IS INVALID THE LOGOUT HANDLING IS ON THE FRONTEND
@api_view(['POST'])
@auth_check
def token_check(request):
    # print(request.session.get("csrftoken"))
    # print(get_token(request))
    return Response(status=status.HTTP_202_ACCEPTED)
