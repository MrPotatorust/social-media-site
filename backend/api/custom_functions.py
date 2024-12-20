from django.core.mail import send_mail
import os
from dotenv import load_dotenv


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