from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin, Security
from flask_security.models import fsqla_v3 as fsq
from datetime import datetime as dt

dbase = SQLAlchemy()
security = Security()
fsq.FsModels.set_db_info(dbase)

class User_Roles(dbase.Model): # Secondary table that stores mamy to many relationship b/w user and role 
    __tablename__ = 'user_roles'
    id = dbase.Column(dbase.Integer, primary_key=True)
    user_id = dbase.Column(dbase.Integer, dbase.ForeignKey('user.id'))
    role_id = dbase.Column(dbase.Integer, dbase.ForeignKey('role.id'))

class User(dbase.Model, UserMixin):
    __tablename__ = 'user'
    id = dbase.Column(dbase.Integer, primary_key=True, nullable=False, unique=True)
    name = dbase.Column(dbase.String, nullable=False)
    email = dbase.Column(dbase.String, nullable=False)
    password = dbase.Column(dbase.String, nullable=False)
    active = dbase.Column(dbase.Boolean()) # Used for validating the user 
    roles = dbase.relationship('Role', secondary='user_roles', backref='users')
    #Taken care by flask-security
    fs_uniquifier = dbase.Column(dbase.String, nullable=False)
    last_login_at = dbase.Column(dbase.DateTime, default=dt.now())
    #current_login_at = dbase.Column(dbase.DateTime, default=dt.now()) # Not Required 
    #current_login_ip = dbase.Column(dbase.String, default="00.00.00.00") # Not Required 
    #login_count = dbase.Column(dbase.Integer, default=0)

    # Relations
    rel_record_id = dbase.relationship('Record', backref='user_dbase', lazy=False)

class Role(dbase.Model, RoleMixin): 
    __tablename__ = 'role'
    id = dbase.Column(dbase.Integer, primary_key=True)
    name = dbase.Column(dbase.String, unique=True, nullable=False)
    description = dbase.Column(dbase.String, nullable=False)

class Book(dbase.Model):
    __tablename__ = 'book'
    id = dbase.Column(dbase.Integer, primary_key=True )
    name = dbase.Column(dbase.String, nullable=False, unique=True)
    author = dbase.Column(dbase.String, nullable=False)
    subtitle = dbase.Column(dbase.String, nullable=False)
    ###sec_id = dbase.Column(dbase.Integer, dbase.ForeignKey('section.id'), nullable=False)
    content = dbase.Column(dbase.String)
    image = dbase.Column(dbase.String, nullable=False, unique=True)
    year = dbase.Column(dbase.Integer, nullable=False)

class Section(dbase.Model):
    __tablename__ = 'section'
    id = dbase.Column(dbase.Integer, primary_key=True)
    name = dbase.Column(dbase.String)
    ###bookdatabase = dbase.relationship('Book', backref='section', lazy=False)

class Record(dbase.Model):
    __tablename__ = 'record'
    id = dbase.Column(dbase.Integer, primary_key=True)
    user_id = dbase.Column(dbase.Integer, dbase.ForeignKey('user.id'), nullable=False)
    book_id = dbase.Column(dbase.Integer, dbase.ForeignKey('book.id'), nullable=False)
    status = dbase.Column(dbase.String, nullable=False, default='Requested')
    req_date = dbase.Column(dbase.Date)
    ret_date = dbase.Column(dbase.Date)