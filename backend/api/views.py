from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from .models import Post
from django.contrib.auth.models import User
from .serializers import PostSerializer

from rest_framework.decorators import api_view


# Create your views here.

@api_view(['POST'])
def create_post(request):
    serializer = PostSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def read_post(request, pk):
    queryset = Post.objects.filter(id=pk)
    return Response(PostSerializer(queryset).data)

@api_view(['GET'])
def read_posts(requst):
    return Response(PostSerializer(Post.objects.all()[0:20], many=True).data)