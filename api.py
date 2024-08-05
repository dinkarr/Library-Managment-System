from flask import Blueprint, request, jsonify
from flask_restful import Api, Resource , reqparse , marshal_with , fields
from model import dbase, Book, Record
from flask_jwt_extended import jwt_required
from flask_security import Security, SQLAlchemyUserDatastore, login_required, login_user, logout_user , auth_required , roles_required
"""
api_bp = Blueprint('api', __name__)
api = Api(api_bp)


def register_api(app):
    app.register_blueprint(api_bp, url_prefix='/api')
"""

api = Api(prefix='/api')
# Creating a request parser / Whenever some one send request it will pass the req object and returns a dictionary 
parser = reqparse.RequestParser()
parser.add_argument('name', type = str , help = "book Name invalid typr" , required = True )
parser.add_argument('author', type = str , help = "book author invalid typr" , required = True)
parser.add_argument('subtitle', type = str , help = "book subtitle invalid typr" , required = True )
parser.add_argument('content', type = str , help = "book content invalid typr" , required = True)
parser.add_argument('image', type = str , help = "book image invalid typr" , required = True)
parser.add_argument('year', type = int , help = "book Name invalid typr",required = True)

# Creating fields | Note-> If we remove any field , it will not be sent 
book_fields = {
    "id" : fields.Integer,
    "name" : fields.String ,
    "author": fields.String,
    "subtitle": fields.String ,
    "content": fields.String ,
    "image": fields.String,
    "year": fields.Integer
}



class LMS(Resource): # For whole application 
    @marshal_with(book_fields) # We are sending all the materials objects that we defined above 
    def get(self):
        all_books = Book.query.all() # table_name.query.all() # we can use filter_by also 
        """
        # Used to send custom messages along with exit codes 
        if len(all_books) < 0 :
            return {"message": "No Resource found"} , 404
        """
        return all_books 
    
    def post(self):
        args = parser.parse_args()
        add_book = Book(**args)
        dbase.session.add(add_book)
        # Before commiting check the required fields , if empty dont commit else commit . For this use required = True in arg section , so we dont have to check hear 
        dbase.session.commit()
        return {"message":"Book Added Sucessfully"}









api.add_resource(LMS , '/')
