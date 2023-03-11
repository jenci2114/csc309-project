
from ..serializer import RegisterSerializer, ProfileEditSerializer
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView, RetrieveAPIView, UpdateAPIView
from rest_framework.response import Response
from rest_framework import status, permissions

# class-based apiview for register user
class RegisterView(CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class ProfileView(RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(ProfileEditSerializer(request.user).data)


class ProfileEditView(UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def put(self, request):
        serializer = ProfileEditSerializer(request.user, data=request.data)
        if serializer.is_valid():
            self.get_object().avatar_url.delete()
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



