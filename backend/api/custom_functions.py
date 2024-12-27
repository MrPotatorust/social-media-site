from django.core.mail import send_mail
from django.conf import settings

from dotenv import load_dotenv
import os
import secrets
import hmac
import hashlib


# ! REWORK THIS LATER BECAUSE IT JUST SEND THE DATA TO ONLY ONE EMAIL ADRESS DURING DEVELOPMENT
def send_email(subject, message):
    load_dotenv()
    send_mail(
    subject=subject,
    message=message,
    from_email=os.getenv('DEFAULT_FROM_EMAIL'),
    recipient_list=[os.getenv('DEFAULT_TO_EMAIL')],
    fail_silently=False,
)

# ! REWORK THIS rework this so its more safe the tokens it generates now are easy to crack
# ? basic imitation of djangos "PasswordResetTokenGenerator"

class EmailVerificationGenerator:
    secret = settings.SECRET_KEY
    salt = secrets.token_bytes(32)