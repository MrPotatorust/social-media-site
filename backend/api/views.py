from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from .models import Post
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .serializers import PostSerializer, UserSerializer, CreatePostSerializer
from django.middleware.csrf import get_token

from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token


# Create your views here.

@api_view(['POST'])
def create_post(request):
    serializer = CreatePostSerializer(data=request.data)    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def read_post(request, pk):
    queryset = Post.objects.filter(id=pk)
    return Response(PostSerializer(queryset).data)

@api_view(['GET'])
def read_posts(request):
    print(request.COOKIES.get('iamdead5'))
    return Response(PostSerializer(Post.objects.all()[0:20], many=True).data, status=status.HTTP_200_OK)

@api_view(['POST'])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@api_view(['POST'])
def login_user(request):
    username = request.data['username']
    password = request.data['password']

    user = authenticate(username=username, password=password)
    print(request.COOKIES.get('iamdead5'))
    if user:
        response = Response(status=status.HTTP_200_OK)
        response.set_cookie(
            key='iamdead5', 
            value="iamskinns",  # Assuming you're using token authentication
            httponly=True,  # Crucial for HTTP-only
            secure=True,    # Only sent over HTTPS
            path="/frontend/html",
            samesite='Strict'  # Prevents CSRF
        )
        return response
    return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def test_token(request):
    cookie = request.COOKIES.get('iamdead5')
    print(cookie)
    if cookie:
        return Response(cookie, status=status.HTTP_200_OK)
    
    response = Response(status=status.HTTP_400_BAD_REQUEST)
    response.set_cookie(
        key='iamdead3', 
        value="909fdsfs880",  # Assuming you're using token authentication
        httponly=True,  # Crucial for HTTP-only
        secure=True,    # Only sent over HTTPS
        samesite='strict'  # Prevents CSRF
    )
    print(response)
    return response


@api_view(['GET'])
def get_new_csrf(request):
    return Response({
        'csrfToken': get_token(request)
    })