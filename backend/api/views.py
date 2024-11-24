from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from .models import Post
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from .serializers import PostSerializer, UserSerializer, CreatePostSerializer
from django.middleware.csrf import get_token
from datetime import timedelta
from django.utils.timezone import now

from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token


# Create your views here.

@api_view(['POST'])
def create_post(request):
    print(request.data)
    # serializer = CreatePostSerializer(data=request.data)
    # if serializer.is_valid():
    #     serializer.save()
    #     return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def read_post(request, pk):
    queryset = Post.objects.filter(id=pk)
    return Response(PostSerializer(queryset).data)


@api_view(['GET'])
def read_posts(request):
    return Response(PostSerializer(Post.objects.all()[0:20], many=True).data, status=status.HTTP_200_OK)


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
            Response(status=status.HTTP_400_BAD_REQUEST)
    
    return Response(status=status.HTTP_400_BAD_REQUEST)