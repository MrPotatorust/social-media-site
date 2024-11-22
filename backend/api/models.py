from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Post(models.Model):
    title = models.CharField(max_length=30)
    text = models.TextField()
    pub_date = models.DateField(auto_now_add=True)
    likes = models.IntegerField(default=0)
    reposts = models.IntegerField(default=0)
    saves = models.IntegerField(default=0)
    author = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title