from rest_framework.authentication import BaseAuthentication, get_authorization_header
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _

class TokenAuthentication(BaseAuthentication):
    """
    Simple token based authentication.

    Clients should authenticate by passing the token key in the "Authorization"
    HTTP header, prepended with the string "JWT ". For example:

        Authorization: JWT 401f7ac837da42b97f613d789819ff93537bee6a
    """
    keyword = 'JWT'
    model = get_user_model()

    def authenticate(self, request):
        auth_header = get_authorization_header(request).split()

        if not auth_header or auth_header[0].decode().lower() != self.keyword.lower().encode():
            return None

        if len(auth_header) == 1:
            msg = _('Invalid token header. No credentials provided.')
            raise AuthenticationFailed(msg)
        elif len(auth_header) > 2:
            msg = _('Invalid token header. Token string should not contain spaces.')
            raise AuthenticationFailed(msg)

        try:
            token = auth_header[1].decode()
        except UnicodeError:
            msg = _('Invalid token header. Token string should not contain invalid characters.')
            raise AuthenticationFailed(msg)

        return self.authenticate_credentials(token)

    def authenticate_credentials(self, token):
        """
        Returns an user that matches the token or None if no user is found.
        """
        try:
            payload = jwt.decode(token, settings.SECRET_KEY)
            user = self.model.objects.get(pk=payload['user_id'])
        
        except (jwt.DecodeError, self.model.DoesNotExist):
            raise AuthenticationFailed(_('Invalid token.'))
        
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed(_('Token has expired.'))
        
        if not user.is_active:
            raise AuthenticationFailed(_('User inactive or deleted.'))

        return (user, token)
