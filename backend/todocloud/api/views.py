from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from database.models import TodoItem
from .serializers import TodoItemSerializer

class TodoItemListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Fetch all TodoItems belonging to the logged-in user
        todo_items = TodoItem.objects.filter(owner=request.user).order_by('order')
        serializer = TodoItemSerializer(todo_items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        # Create a new TodoItem for the logged-in user
        data = request.data.copy()  # Make a mutable copy of the request data
        data['owner'] = request.user.id  # Add the logged-in user as the owner
        serializer = TodoItemSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TodoItemDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            return TodoItem.objects.get(pk=pk, owner=user)
        except TodoItem.DoesNotExist:
            return None

    def delete(self, request, pk):
        todo_item = self.get_object(pk, request.user)
        if not todo_item:
            return Response({'error': 'TodoItem not found or not authorized.'}, status=status.HTTP_404_NOT_FOUND)
        todo_item.delete()
        return Response({'message': 'TodoItem deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)

    def put(self, request, pk):
        todo_item = self.get_object(pk, request.user)
        if not todo_item:
            return Response({'error': 'TodoItem not found or not authorized.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = TodoItemSerializer(todo_item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
