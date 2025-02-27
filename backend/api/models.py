from django.db import models
from django.contrib.auth.models import User, AbstractUser
from django.db.models import UniqueConstraint
from django.conf import settings

# Create your models here.


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)

class Post(models.Model):
    text = models.TextField(null=False)
    pub_date = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    main_post = models.BooleanField()
    class Meta:
        ordering=["-pub_date"]

    def __str__(self):
        return self.text
    
class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="original_posts")
    comment_post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comment_posts")

    def __str__(self):
        return f"{self.post.text}, {self.comment_post.text}"

class Hashtag(models.Model):
    tag = models.CharField(max_length=32, unique=True)
    created_at = models.DateField(auto_now_add=True)
    mentions = models.IntegerField(default=1)

    def __str__(self):
        return self.tag

class PostHashtag(models.Model):
    post_id = models.ForeignKey(Post, on_delete=models.CASCADE)
    hashtag_id = models.ForeignKey(Hashtag, on_delete=models.CASCADE)

    def __str__(self):
        return f"post_id: {self.post_id}, hashtag_id: {self.hashtag_id}"

class Like(models.Model):
    user_id = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post_id = models.ForeignKey(Post, on_delete=models.CASCADE)
    created_at = models.DateField(auto_now_add=True)

    class Meta:

        constraints=[
            models.UniqueConstraint(fields=["post_id", "user_id"], name="post_id__user_id-like")
        ]
        
    def __str__(self):
            return self.post_id, self.user_id

class Dislike(models.Model):
    user_id = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post_id = models.ForeignKey(Post, on_delete=models.CASCADE)
    created_at = models.DateField(auto_now_add=True)

    class Meta:

        constraints=[
            models.UniqueConstraint(fields=["post_id", "user_id"], name="post_id__user_id-dislike")
        ]


    def __str__(self):
        return f"{self.user_id}, {self.post_id}"


class Save(models.Model):
    user_id = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post_id = models.ForeignKey(Post, on_delete=models.CASCADE)
    created_at = models.DateField(auto_now_add=True)

    class Meta:

        constraints=[
            models.UniqueConstraint(fields=["post_id", "user_id"], name="post_id__user_id-save")
        ]


class Repost(models.Model):
    user_id = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post_id = models.ForeignKey(Post, on_delete=models.CASCADE)
    created_at = models.DateField(auto_now_add=True)

    class Meta:

        constraints=[
            models.UniqueConstraint(fields=["post_id", "user_id"], name="post_id__user_id-repost")
        ]


class Image(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    image_name = models.CharField(max_length=30)
    file_path = models.CharField(default="default_image.jpg", max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Country(models.Model):
    iso = models.CharField(max_length=2, null=False, unique=True)
    name = models.CharField(max_length=48, null=False, unique=True)


class UserMetaData(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    last_action = models.DateTimeField(auto_now_add=True)
    email_verified = models.BooleanField(default=False)
    is_setup = models.BooleanField(default=False)
    description = models.CharField(max_length=120)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, default=1)
    language = models.CharField(max_length=13) # ! This has to be reworked with another model 
    private = models.BooleanField(default=True)
    profile_img = models.ForeignKey(Image, on_delete=models.CASCADE, default=1)
    last_reset_email_sent = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        return f"{self.user} {self.last_action} {self.email_verified} {self.language} {self.private}"


class EmailAuthToken(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    token = models.CharField(max_length=32)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering=['-created_at']


class PasswordResetToken(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    token = models.CharField(max_length=32, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user} {self.token} {self.created_at}"

    class Meta:
        ordering=['-created_at']