from rest_framework import serializers
from .models import Post, Likes, UserMetaData
from django.contrib.auth.models import User


class PostSerializer(serializers.ModelSerializer):

    author = serializers.CharField()
    likes_count = serializers.IntegerField()
    reposts_count = serializers.IntegerField()
    saves_count = serializers.IntegerField()
    liked = serializers.BooleanField()
    saved = serializers.BooleanField()
    reposted = serializers.BooleanField()

    class Meta:
        model = Post
        fields = ['id', 'title', 'text', 'pub_date', 'author', 'likes_count', 'saves_count', 'reposts_count', 'liked', 'saved', 'reposted']



class CreatePostSerializer(serializers.ModelSerializer):

    class Meta:
        model = Post
        fields = ['title', 'text', 'author']


class UserRegisterSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = '__all__'




class UserMetaDataSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserMetaData
        fields = '__all__'

class ProfileSerializer(serializers.ModelSerializer):

    usermetadata = UserMetaDataSerializer()

    class Meta:
        model = User
        fields = ['username', 'last_login', 'date_joined', 'usermetadata']