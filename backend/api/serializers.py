from rest_framework import serializers
from .models import CustomUser, Post, Like, UserMetaData, Image, Country, Hashtag, PostHashtag, Comment
from django.conf import settings

class LoggedOutPostSerializer(serializers.ModelSerializer):
    author = serializers.CharField()
    like_count = serializers.IntegerField()
    dislike_count = serializers.IntegerField()
    repost_count = serializers.IntegerField()
    save_count = serializers.IntegerField()
    comment_count = serializers.IntegerField()

    class Meta:
        model = Post
        fields = ['id', 'text', 'pub_date', 'author', 'like_count', 'dislike_count', 'save_count', 'repost_count', 'comment_count']
        ordering=["pub_date"]

class LoggedInPostSerializer(LoggedOutPostSerializer):

    liked = serializers.BooleanField()
    disliked = serializers.BooleanField()
    saved = serializers.BooleanField()
    reposted = serializers.BooleanField()

    class Meta:
        model = Post
        fields = ['id', 'text', 'pub_date', 'author', 'like_count', 'dislike_count', 'save_count', 'repost_count', 'comment_count', 'liked', 'disliked', 'saved', 'reposted']


class CreatePostSerializer(serializers.ModelSerializer):

    class Meta:
        model = Post
        fields = ['text', 'author', 'main_post']


class CreateCommentSerializer(serializers.ModelSerializer):
    comment_post = CreatePostSerializer()  # This will accept post data instead of just an ID
    
    class Meta:
        model = Comment
        fields = ['post', 'comment_post']  # post will be the ID of the existing post

    def create(self, validated_data):
        # Extract the post data
        comment_post_data = validated_data.pop('comment_post')
        
        # Create the new post
        comment_post = Post.objects.create(**comment_post_data)
        
        # Create the comment connecting both posts
        comment = Comment.objects.create(
            post=validated_data['post'],
            comment_post=comment_post
        )
        
        return comment

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
        model = CustomUser
        fields = '__all__'

    def create(self, validated_data):
        user = CustomUser.objects.create(**validated_data)
        print(user)
        UserMetaData.objects.create(user=user)
        return user
    
class ChangePasswordSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ['password']

# class ProfileSerializer(serializers.ModelSerializer):

#     usermetadata = UserMetaDataSerializer()

#     class Meta:
#         model = CustomUser
#         fields = ['username', 'last_login', 'date_joined', 'usermetadata']

class TestingUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
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