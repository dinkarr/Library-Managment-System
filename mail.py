# Will use Simple Mail Transfer Protocol and my celery worker will run the main.py function and celery beat tell when to run the file and its scheduling 
# Will use Mail-Hog 
# To send request , 1025 | To conect smtp
# to see whats going on , go to 8025 

from email.mime.multipart import MIMEMultipart 
from email.mime.text import MIMEText
import smtplib
from jinja2 import Template

SMTP_SERVER = "localhost" 
SMTP_PORT = 1025          # Port 
SENDER_EMAIL = "LMS Librarian"
SENDER_PASSWORD = ''      # Not needed for mailhog 

def send_email(to, subject, content_body):
    msg = MIMEMultipart() # It means multimedia and it can be transfered in many parts
    msg["To"] = to 
    msg["Subject"] = subject
    msg["From"] = SENDER_EMAIL
    msg.attach(MIMEText(content_body, 'html')) # Want content as HTML 


    client = smtplib.SMTP(host=SMTP_SERVER, port=SMTP_PORT)
    client.send_message(msg=msg)
    client.quit()

# send_email('aditya@iitm.ac.in', 'there is the sub', '<h1> test 02 </h1>')
