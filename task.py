# Creating celery fn that celery will do 
from celery import shared_task 
import time
import flask_excel as make_response_from_query_sets
from model import * 
import pandas as pd
from mail import *



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
    
    # Save CSV to file
    with open('./User-CSV/file.csv', 'w') as file:  # 'w' mode for writing text
        file.write(csv_out)
    
    return "file.csv"  # Returning the name of the     


    # if csv_out:
    #     return (csv_out) , 200
    # else:
    #     return ({"message":"No books found , DB is empty"}) , 404


@shared_task(ignore_result=True)  # Celery that is tiggring the mailing function 
def daily_reminder(to , subject , message):
    send_email(to, subject, message) # Now i have triggred that send mail fumction 
    return ("Mail sent sucessfully!") # In this case i dont need to return anything , so will use ignore in shared task
    
# Now we need celery beats 