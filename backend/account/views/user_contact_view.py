from rest_framework.generics import get_object_or_404, RetrieveAPIView
from rest_framework.response import Response

from account.models import User
from account.serializer import UserContactSerializer


class UserContactView(RetrieveAPIView):
    serializer_class = UserContactSerializer

    def retrieve(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        user = get_object_or_404(User, id=pk)
        serializer = self.get_serializer(user)
        return Response(serializer.data)
