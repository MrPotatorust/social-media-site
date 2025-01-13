from rest_framework import serializers
from .models import Post, Likes, UserMetaData, Image, Country
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
        fields = ['id', 'text', 'pub_date', 'author', 'likes_count', 'saves_count', 'reposts_count', 'liked', 'saved', 'reposted']



class CreatePostSerializer(serializers.ModelSerializer):

    class Meta:
        model = Post
        fields = ['text', 'author']



class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields= ['image_name', 'file_path']

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields=['iso', 'name']

class UserMetaDataSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserMetaData
        fields = '__all__'
class UserRegisterSerializer(serializers.ModelSerializer):
    
    usermetadata = UserMetaDataSerializer(required=False)

    class Meta:
        model = User
        fields = '__all__'

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create(**validated_data)
        UserMetaData.objects.create(user=user)
        return user

# class ProfileSerializer(serializers.ModelSerializer):

#     usermetadata = UserMetaDataSerializer()

#     class Meta:
#         model = User
#         fields = ['username', 'last_login', 'date_joined', 'usermetadata']

class TestingUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['username', 'date_joined']


class ProfileSerializer(serializers.ModelSerializer):

    profile_img = ImageSerializer()
    country = CountrySerializer()
    user = TestingUserSerializer()

    class Meta:
        model = UserMetaData
        fields = ['country', 'description', 'email_verified', 'language', 'profile_img', 'user']