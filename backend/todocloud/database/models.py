from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class TodoItem(models.Model):
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  deadline = models.DateTimeField(null=True, blank=True)
  owner = models.ForeignKey(User, on_delete=models.CASCADE)
  title = models.CharField(max_length=80)
  description = models.TextField(max_length=800, null=True, blank=True)
  attachment = models.FileField(null=True, blank=True)
  order = models.IntegerField(unique=True)
