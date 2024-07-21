from flask_security import SQLAlchemyUserDatastore
from flask_security.utils import hash_password
from model import *

LIB_EMAIL = "admin@app.com"
LIB_PASSWORD = '12345'

def create_data(user_datastore : SQLAlchemyUserDatastore):
    print("###### Creating Data ######")

    #Create Roles
    user_datastore.find_or_create_role(name='librarian', description='Librarian')
    user_datastore.find_or_create_role(name='user', description='User')
    
    #Create User Data
    if not user_datastore.find_user(email=LIB_EMAIL):
        user_datastore.create_user(
            email=LIB_EMAIL, 
            password=hash_password(LIB_PASSWORD), 
            name="Librarian", 
            active=True,
            roles=['librarian']
        )
    
    if not user_datastore.find_user(email='user@app.com'):
        user_datastore.create_user(
            email='user@app.com', 
            password=hash_password(LIB_PASSWORD), 
            name="User", 
            active=True,
            roles=['user']
        )
        
    dbase.session.commit()