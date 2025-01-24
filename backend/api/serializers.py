from rest_framework import serializers
from .models import Post, Likes, UserMetaData, Image, Country, Hashtag, PostHashtag
from django.contrib.auth.models import User

class LoggedOutPostSerializer(serializers.ModelSerializer):
    author = serializers.CharField()
    like_count = serializers.IntegerField()
    dislike_count = serializers.IntegerField()
    repost_count = serializers.IntegerField()
    save_count = serializers.IntegerField()

    class Meta:
        model = Post
        fields = ['id', 'text', 'pub_date', 'author', 'like_count', 'dislike_count', 'save_count', 'repost_count']
        ordering=["pub_date"]

class LoggedInPostSerializer(LoggedOutPostSerializer):

    liked = serializers.BooleanField()
    disliked = serializers.BooleanField()
    saved = serializers.BooleanField()
    reposted = serializers.BooleanField()


    class Meta:
        model = Post
        fields = ['id', 'text', 'pub_date', 'author', 'like_count', 'dislike_count', 'save_count', 'repost_count', 'liked', 'disliked', 'saved', 'reposted']




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

class HashtagSerializer(serializers.ModelSerializer):

    class Meta:
        model = Hashtag
        fields = ["id", "mentions", "tag"]

class PostHashtagSerializer(serializers.ModelSerializer):

    class Meta:
        model = PostHashtag
        fields = ["*"]