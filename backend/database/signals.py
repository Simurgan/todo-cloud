from django.db.models.signals import post_delete
from django.dispatch import receiver
from storages.backends.gcloud import GoogleCloudStorage
from .models import TodoItem
from django.conf import settings

@receiver(post_delete, sender=TodoItem)
def delete_attachment_from_storage(sender, instance, **kwargs):
    if instance.attachment:
        # Explicitly set bucket name from settings
        storage_backend = GoogleCloudStorage(bucket_name=settings.STORAGES['default']['OPTIONS']['bucket_name'])
        file_path = instance.attachment.name  # Get the file path in the bucket
        print(file_path)
        print("file path above")
        try:
            storage_backend.delete(file_path)  # Delete the file
        except Exception as e:
            # Log the exception or handle it appropriately
            print(f"Error deleting file: {e}")
