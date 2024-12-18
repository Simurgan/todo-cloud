from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class TodoItem(models.Model):
  created_at = models.DateTimeField(auto_now_add=True)
  owner = models.ForeignKey(User, on_delete=models.CASCADE)
  title = models.CharField(max_length=80)
  attachment = models.FileField(upload_to="todo-attachments/", null=True, blank=True)
