# Creating celery fn that celery will do 
from celery import shared_task 
import time
import flask_excel as make_response_from_query_sets
from model import * 
import pandas as pd
from mail import *
from datetime import datetime , timedelta



@shared_task() # This decorater is making celery taks , otherwise its a normat task 
def add(x,y):
    time.sleep(15) # Adding a delay of 15 seconds to check that the task is working or not 
    return (x+y)

# Now we can implemet our exporting jobs and create a csv file with all info   
@shared_task()#ignore_result=True)  # It means it won’t store the values, i.e., the returned result will not be stored in result backend 
def create_csv():
    books = Book.query.with_entities(Book.title, Book.author).all()
    # Convert query results to a list of dictionaries for pandas DataFrame
    data = [{'title': book.title, 'author': book.author} for book in books]
    column_names = ['title', 'author']
    
    # Create DataFrame and export to CSV
    df = pd.DataFrame(data, columns=column_names)
    csv_out = df.to_csv(index=False)
    path = './User-CSV/file.csv'
    # Save CSV to file
    with open(path, 'w') as file:  # 'w' mode for writing text
        file.write(csv_out)
    
    send_file('admin@app.com' ,'Exported CSV File', path , 'PFA: Your CSV' )
    return "file.csv"  # Returning the name of the     

@shared_task(ignore_result=True)  # Celery that is tiggring the mailing function 
def daily_reminder():
    now = datetime.now()
    threshold_time = now - timedelta(hours=24)
    
    users = User.query.all()
    
    sub = "You have not visited in last 24 hours"
    mes = '<h6>Hi User , You have not visited in last 24 hours , Kindly visit some new books are added to LMS</h6>'
    for user in users:
        if user.last_login < threshold_time:
            send_email(user.email, sub, mes) # Now i have triggred that send mail fumction 
    return ("Mail sent sucessfully!") # In this case i dont need to return anything , so will use ignore in shared task


@shared_task(ignore_result=True)
def send_overdue_reminders():
    one_day_ago = datetime.now() - timedelta(days=1)
    
    overdue_records = Record.query.filter(
        Record.status == 'issued',
        Record.retdate == one_day_ago
    ).all()
    
    subject = "Reminder: Return Date Overdue"
    message_template = '<h6>Hi {user_name},<br>Your record with ID {record_id} was due for return on {retdate}. Please return it as soon as possible.</h6>'

    emailed_users = set() # To avoid duplicates 
    
    for record in overdue_records:
        user = record.user
        if user.id not in emailed_users:
            message = message_template.format(user_name=user.username, record_id=record.id, retdate=record.retdate.strftime('%Y-%m-%d'))
            send_email(user.email, subject, message)
            emailed_users.add(user.id)
    return ("Mail sent sucessfully ")
    
def send_monthly_records():
    # Get the current date and calculate the start and end of the current month
    now = datetime.now()
    start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    if now.month == 12:
        start_of_next_month = start_of_month.replace(year=now.year + 1, month=1)
    else:
        start_of_next_month = start_of_month.replace(month=now.month + 1)
    end_of_month = start_of_next_month - timedelta(seconds=1)
    
    # Query records for the current month
    monthly_records = Record.query.filter(
        Record.retdate >= start_of_month,
        Record.retdate <= end_of_month
    ).all()

    # Query all users
    users = User.query.all()

    # Email subject and message
    subject = "Records for the Current Month"
    message_template = '<h6>Hi {user_name},<br>Here are the records for the current month:</h6><ul>{records_list}</ul>'
    
    # Loop through users and send records
    for user in users:
        # Create a list of records for the email
        records_list = ''.join([f'<li>Record ID: {record.id}, Return Date: {record.retdate.strftime("%Y-%m-%d")}</li>' for record in monthly_records])
        message = message_template.format(user_name=user.username, records_list=records_list)
        # Send email
        send_email(user.email, subject, message)
    
    return ( "Monthly records sent to all users successfully!"), 200
