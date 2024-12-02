from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from .models import Post, Likes, Saves, Reposts
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from .serializers import PostSerializer, UserSerializer, CreatePostSerializer
from django.db.models import Count
from django.middleware.csrf import get_token
from datetime import timedelta
from django.utils.timezone import now

from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token


# Create your views here.

def token_verification(request):
    try:
        auth_token = request.COOKIES.get("auth_token")
        token = Token.objects.get(key=auth_token)
        
        token_username = token.user.username
        request_username = request.data['username']

        print(token_username == request_username)

        if token and token_username == request_username:
            return True
        return False
    except:
        return False


@api_view(['POST'])
def create_post(request):
    
    if token_verification(request) == False:
        return Response(status=status.HTTP_401_UNAUTHORIZED)


    post_data = {
        "title":request.data["title"],
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


@api_view(['GET'])
def read_posts(request):
    queryset = Post.objects.all()[0:20].annotate(likes_count = Count("likes")).annotate(saves_count = Count("saves")).annotate(reposts_count = Count("reposts"))
    return Response(PostSerializer(queryset, many=True).data, status=status.HTTP_200_OK)


@api_view(['POST'])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login_user(request):
    username = request.data['username']
    password = request.data['password']


    user = authenticate(username=username, password=password)
    if user:
        token, created = Token.objects.get_or_create(user=user)
        response = Response(status=status.HTTP_200_OK)
        response.set_cookie(
            key='auth_token', 
            value=token.key,  # Assuming you're using token authentication
            expires=now() + timedelta(days=30),
            httponly=True,  # Crucial for HTTP-only
            secure=False,    # Only sent over HTTPS
            path="/",
            samesite='strict'  # Prevents CSRF
        )

        return response
    return Response(status=status.HTTP_401_UNAUTHORIZED)


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
def like(request):


    if token_verification(request) == False:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    data = request.data

    try:
        user = Token.objects.get(key=request.COOKIES.get("auth_token")).user
        post = Post.objects.get(id=data["post_id"])
    except:
        return Response("failed to get an object instance", status=status.HTTP_400_BAD_REQUEST)

    try:
        Likes.objects.get(user_id=user, post_id=post).delete()
        return Response("disliked", status=status.HTTP_200_OK)
    except:
        Likes.objects.create(user_id=user, post_id=post)
        return Response("liked", status=status.HTTP_200_OK)


# ! IF THE TOKEN IS INVALID THE LOGOUT HANDLING IS ON THE FRONTEND
@api_view(['POST'])
def token_check(request):
    if token_verification(request):
        return Response(status=status.HTTP_100_CONTINUE)
    return Response(status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)
