from flask import Flask , render_template , request , redirect , url_for , flash , session , jsonify , url_for 
from model import *  
from api import *
import os
from sqlalchemy import func
from flask_security.utils import hash_password, verify_password
from flask_security import Security, SQLAlchemyUserDatastore, login_required, login_user, logout_user , auth_required , roles_required
from flask_jwt_extended import JWTManager, create_access_token
from flask_restful import Api , marshal_with , fields , marshal
from create_initial_data import create_data
from api import *
from werkzeug.security import check_password_hash , generate_password_hash
curr_dict = os.path.abspath(os.path.dirname(__file__))


app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.sqlite3" 
api.init_app(app)
# Configrations 
app.secret_key = 'hsadbuhv3882vbgv23g2v3g23v' # For session 
app.config['SECRET_KEY'] = 'hsadbuhv3882vbgv23g2v3g23v' # for flask session 
app.config['SECURITY_PASSWORD_SALT'] = 'salt' # Encrypting the password 
app.config['JWT_SECRET_KEY'] = 'AKASMNGAKWGK.MWELVNQEWBHJQWVNJKQW'
app.config['WTF_CSRF_ENABLED'] = app.config.get('WTF_CSRF_ENABLED', False)  # Disable CSRF for APIs
app.config['SECURITY_TOKEN_AUTHENTICATION_HEADER'] = 'Authentication-Token'  # Token authentication header
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Disable modification tracking
app.config['DEBUG'] = app.config.get('DEBUG', True)  # Enable debug mode




dbase.init_app(app)
jwt= JWTManager(app)
app.app_context().push()

# Register the API blueprint
#register_api(app) # Anuj
with app.app_context():
    user_datastore = SQLAlchemyUserDatastore(dbase, User, Role)
    security.init_app(app, user_datastore)
    #dbase.drop_all()
    dbase.create_all()
    # create_data(user_datastore)
    #create_data(user_datastore)
    # Only run create_data if not in reloader
    if os.environ.get('WERKZEUG_RUN_MAIN') == 'true':
        create_data(user_datastore)
# Some keywords 
rt = render_template


@app.get('/') # , methods = ['GET','POST'])
def home():
    return render_template("index.html")


@app.get('/admin') # Whole point of creating this to check RBAC 
@auth_required("token") # Token base authintication 
@roles_required("librarian") # Checking the role and giving acess 
def admin():
    return "Welcome admin !"


@app.get('/activate/user/<int:user_id>')  # Not Required for LMS 
@auth_required("token")  
@roles_required("librarian")  
def activate_user(user_id):
    user = User.query.get(user_id)
    if not user or "user" not in user.roles:
        return jsonify({"message" : "User not found / dosent exist "}) , 404
    user.active = True
    dbase.session.commit()
    return jsonify({"message":"User activated sucessfully"}) 

@app.post('/user_login') # In this the cookie will not be stored . # Login for admin also 
def user_login():
    data = request.get_json() # This is the data we have , will try to fetch the email and password 
    email = data.get('email')
    if not email :
        return jsonify({"message": "E-MAIL not found , Enter a valid Mail ID" }) , 400
    user = user_datastore.find_user(email = email)
    if not user:
        return jsonify({"message": "USER not found , kindly SignUP" }) , 404
    if check_password_hash(user.password , data.get('password')): # data_base pass , input pass 
        # Insted of token(In body) we can return user role , email and etc
        return jsonify({"token": user.get_auth_token() , "email" : user.email , "role" : user.roles[0].name}) , 200 ##user.roles[0].name }) , 200 # Why list and why .name ???  ## "user"
    else:
        return jsonify({"message": "Wrong password , kindly re-enter" }) , 400

@app.post('/signup')
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not email or not name or not password :
        return jsonify({"message": "Fields cant be empty , Kindly provide" }) , 400
    if User.query.filter_by(email = email).first() :
        return jsonify({'message':'User already exist , kindly login'}) , 400
    user_role = user_datastore.find_or_create_role(name='user')
    #if not User.query.filter_by(email = email).all() :
    user_datastore.create_user(
        name = data.get('name') ,
        email = data.get('email') ,
        password = generate_password_hash(data.get('password')),
        roles=[user_role]
    )
    dbase.session.commit()
        
    return jsonify({'message':'User created successfully , kindly login'}) , 201


# Creating for the User so that the librarian can see them 
user_fields = {
    "id" : fields.Integer,
    "name" : fields.String ,
    "email": fields.String,
    "last_login_at": fields.String ,
    "active": fields.Boolean 
}

@app.get('/user_info')
@auth_required("token")  
@roles_required("librarian")  
def user_info():
    users = User.query.all()
    if len(users) == 0:
        return jsonify({"message":"No user found"}), 404
    return marshal(users , user_fields)



if __name__=='__main__':
    #dbase.create_all()
    dbase.debug = True
    app.debug = True
    app.run(port = 3456)

# #8.76 confussing
# # 1:16:18 # admin dashboard and checking the user typr and all other factors    
## Problem that the user is creating twice 
## Other problem is localStorage , everytime i loging as user and then login as admin , the local storage is empty 
