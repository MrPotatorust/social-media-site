from django.core.mail import send_mail
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.conf import settings
from .models import UserMetaData
from rest_framework.response import Response
from rest_framework import generics, status
from django.contrib.auth.models import User
from datetime import timedelta
from django.utils import timezone
from .models import Post, Likes, Saves, Reposts, UserMetaData, PasswordResetToken, EmailAuthToken
from django.utils.http import base36_to_int, int_to_base36
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags


from dotenv import load_dotenv
import os
import secrets
import hmac
import hashlib


# ! REWORK THIS LATER BECAUSE IT JUST SEND THE DATA TO ONLY ONE EMAIL ADRESS DURING DEVELOPMENT
def send_email(subject, html_content):
    load_dotenv()

    text_content = strip_tags(html_content)

    email = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email=os.getenv('DEFAULT_FROM_EMAIL'),
        to=[os.getenv('DEFAULT_TO_EMAIL')],

    )

    email.attach_alternative(html_content, "text/html")

    email.send()

    # send_mail(
    # subject=subject,
    # message=message,
    # from_email=os.getenv('DEFAULT_FROM_EMAIL'),
    # recipient_list=[os.getenv('DEFAULT_TO_EMAIL')],
    # fail_silently=False,
    # )

#! finish this function for hashing the tokens stored in the database
def make_hash():
    return None


class EmailVerificationTokenGenerator(PasswordResetTokenGenerator):
    """
    This is less safe because the login timestamp has been removed.
    Using the email_verified inside because it should change and invalidate the token.
    """

    key_salt = "custom_functions.EmailVerificationTokenGenerator"

    def _make_hash_value(self, user, timestamp):
        usermetadata = UserMetaData.objects.get(user=user)

        """
        Changed the return value,
        - removed user.password, login_timestamp
        - added usermetada.email_verified
        """
        email_field = user.get_email_field_name()
        email = getattr(user, email_field, "") or ""
        return f"{user.pk}{user.password}{usermetadata.email_verified}{timestamp}{email}"
    

class ResetVerificationTokenManager:
    

    make_hash = make_hash()

    def __init__(self, generator, django_model):
        self.generator = generator()
        self.django_model = django_model


    """
    The url is based on the generator
    Enter the &&&*&&& where you want the code to be.
    """
    def send_token(self, user, email_subject, email_template, timeout_time, valid_time, anonymous_response):
        
        email = user.email
        
        try:
            usermedatadata = UserMetaData.objects.get(user=user)
            # ? dont send a new email for "timeout_time" minutes
            if (timezone.now() - usermedatadata.last_reset_email_sent) < timedelta(minutes=timeout_time):
                if anonymous_response:
                    return Response(status=status.HTTP_200_OK)
                return Response("sorry you have to wait before sending another request", status=status.HTTP_400_BAD_REQUEST)
                # return Response(f'You have to wait {timedelta(minutes=5) - (timezone.now() - usermedatadata.last_reset_email_sent)} minutes before sending another email.',status=status.HTTP_200_OK)

            latest_token = self.django_model.objects.filter(user=user).first()


            # ? if the token is still valid send an email with it
            if latest_token:
                if (timezone.now() - latest_token.created_at) < timedelta(minutes=valid_time) and self.generator.check_token(user, latest_token.token):
                    email_message = render_to_string(email_template, {"email": email, "token": latest_token.token})
                    send_email(email_subject, email_message)
                    usermedatadata.last_reset_email_sent = timezone.now()
                    usermedatadata.save()
                    if anonymous_response:
                        return Response(status=status.HTTP_200_OK)
                    return Response("email has been sent again", status=status.HTTP_200_OK)
                    # return Response('sent another email',status=status.HTTP_200_OK)
            
            # ? if the token is no longer valid create a new one
            generated_token = self.generator.make_token(user)
            saved_token = self.django_model(user=user, token=generated_token)
            saved_token.save()

            email_message = render_to_string(email_template, {"email": email, "token": generated_token})
            send_email(email_subject, email_message)
            usermedatadata.last_reset_email_sent = timezone.now()
            usermedatadata.save()
        except User.DoesNotExist:
            return Response(status=status.HTTP_200_OK)
        except:
            return Response('something went wrong', status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(status=status.HTTP_200_OK)
    
    def validity(self, token, timeout_time):
        try:
            model = self.django_model.objects.get(token=token)
            user = model.user
            if (timezone.now() - model.created_at) > timedelta(minutes=timeout_time) or self.generator.check_token(user, token) == False:
                return Response('This link is no longer valid', status=status.HTTP_400_BAD_REQUEST)
            usermetadata = UserMetaData.objects.get(user=user)
            usermetadata.email_verified = True
            usermetadata.save()
        
        except:
            return Response('The link is no longer valid', status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)