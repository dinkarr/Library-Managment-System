from flask import Flask , render_template , request , redirect , url_for , flash , session , jsonify
from model import *
from api import *
import os
from sqlalchemy import func
from flask_security.utils import hash_password, verify_password
from flask_security import Security, SQLAlchemyUserDatastore, login_required, login_user, logout_user
from flask_jwt_extended import JWTManager, create_access_token
from flask_restful import Api
from create_initial_data import create_data
from api import * #register_api


curr_dict = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.sqlite3" 
api.init_app(app)
app.secret_key = 'hsadbuhv3882vbgv23g2v3g23v'
# Configrations 
app.config['SECRET_KEY'] = 'hsadbuhv3882vbgv23g2v3g23v'
app.config['SECURITY_PASSWORD_SALT'] = 'salt'
app.config['JWT_SECRET_KEY'] = 'AKASMNGAKWGK.MWELVNQEWBHJQWVNJKQW'

dbase.init_app(app)
jwt= JWTManager(app)
app.app_context().push()

# Register the API blueprint
#register_api(app) # Anuj
with app.app_context():
    user_datastore = SQLAlchemyUserDatastore(dbase, User, Role)
    security.init_app(app, user_datastore)

    # db.drop_all()
    dbase.create_all()
    create_data(user_datastore)
    # create_data(user_datastore)

@app.route('/', methods = ['GET','POST'])
def home():
    return render_template("ind.html")


if __name__=='__main__':
    dbase.create_all()
    dbase.debug = True
    app.debug = True
    app.run(port = 3456)
