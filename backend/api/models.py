from django.db import models
from django.contrib.auth.models import User
from django.db.models import UniqueConstraint

# Create your models here.

class Post(models.Model):
    title = models.CharField(max_length=30)
    text = models.TextField()
    pub_date = models.DateField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class Likes(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    post_id = models.ForeignKey(Post, on_delete=models.CASCADE)
    created_at = models.DateField(auto_now_add=True)

    class Meta:

        constraints=[
            models.UniqueConstraint(fields=["post_id", "user_id"], name="post_id__user_id-likes")
        ]

    def __str__(self):
        return f"{self.user_id}, {self.post_id}"


class Saves(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    post_id = models.ForeignKey(Post, on_delete=models.CASCADE)
    created_at = models.DateField(auto_now_add=True)

    class Meta:

        constraints=[
            models.UniqueConstraint(fields=["post_id", "user_id"], name="post_id__user_id-saves")
        ]


class Reposts(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    post_id = models.ForeignKey(Post, on_delete=models.CASCADE)
    created_at = models.DateField(auto_now_add=True)

    class Meta:

        constraints=[
            models.UniqueConstraint(fields=["post_id", "user_id"], name="post_id__user_id-reposts")
        ]


class UserMetaData(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    last_action = models.DateTimeField()
    email_verified = models.BooleanField()
    language = models.CharField(max_length=13) # ! This has to be reworked with another model 
    private = models.BooleanField()


    def __str__(self):
        return f"{self.user} {self.last_action} {self.email_verified} {self.language} {self.private}"