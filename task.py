# Creating celery fn that celery will do 
from celery import shared_task


# Lets create a simple add function

@shared_task() # This decorater is making celery taks , otherwise its a normat task 
def add(x,y):
    return (x*y)
