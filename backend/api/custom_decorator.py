from functools import wraps
from rest_framework.response import Response
from rest_framework import status
from rest_framework.renderers import JSONRenderer
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view


def auth_check(func):

    @wraps(func)
    def wrapper(request, *args, **kwargs):
        try:
            auth_token = request.COOKIES.get("auth_token")


            if not auth_token:
                return Response(status=status.HTTP_401_UNAUTHORIZED)

            token = Token.objects.get(key=auth_token)
            
            token_username = token.user.username
            request_username = request.data['username']

            print(token_username == request_username)

            if token and token_username == request_username:
                return func(request, *args, **kwargs)
            
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        except:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
    return wrapper