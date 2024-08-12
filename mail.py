# Will use Simple Mail Transfer Protocol and my celery worker will run the main.py function and celery beat tell when to run the file and its scheduling 
# Will use Mail-Hog 
# To send request , 1025 | To conect smtp
# to see whats going on , go to 8025 

from email.mime.multipart import MIMEMultipart 
from email.mime.text import MIMEText
import smtplib
from jinja2 import Template
from email.mime.base import MIMEBase
from email import encoders
import os as os

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

def send_file(to, subject, attachment_path, msg):
    
    try:
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = to
        # msg['Date'] = formatdate(localtime=True)
        msg['Subject'] = subject
        msg.attach(MIMEText(msg))

        part = MIMEBase('application', 'octet-stream')
        part.set_payload(open(attachment_path, 'rb').read())
        encoders.encode_base64(part)
        part.add_header('Content-Disposition', f'attachment; filename="{os.path.basename(attachment_path)}"')
        msg.attach(part)

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, to, msg.as_string())

    except smtplib.SMTPAuthenticationError as e:
        print(f"SMTP Authentication Error: {e}")
    except smtplib.SMTPException as e:
        print(f"SMTP Error: {e}")
    except Exception as e:
        print(f"General Error: {e}")