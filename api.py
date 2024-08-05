from flask import Blueprint, request, jsonify
from flask_restful import Api, Resource , reqparse , marshal_with , fields 
from model import dbase, Book, Record , Section
from flask_security import auth_required , roles_required
from flask_jwt_extended import jwt_required
from flask_security import Security, SQLAlchemyUserDatastore, login_required, login_user, logout_user , auth_required , roles_required

api = Api(prefix='/api')



# Adding New Book
# Creating a request parser / Whenever some one send request it will pass the req object and returns a dictionary 
parser = reqparse.RequestParser()
parser.add_argument('title', type = str , help = "book Name invalid type" , required = True )
parser.add_argument('author', type = str , help = "book author invalid type" , required = True)
parser.add_argument('subtitle', type = str , help = "book subtitle invalid type" , required = True )
parser.add_argument('content', type = str , help = "book content invalid type" , required = True)
parser.add_argument('image', type = str , help = "book image invalid type" , required = True)
parser.add_argument('year', type = int , help = "book Name invalid type",required = True)
parser.add_argument('section_name',type=str, required = True , help = "Section Name invalid type")

# Creating fields | Note-> If we remove any field , it will not be sent 
book_fields = {
    "title" : fields.String ,
    "author": fields.String,
    "subtitle": fields.String ,
    "content": fields.String ,
    "image": fields.String,
    "year": fields.Integer,
    "sec_id": fields.Integer
}
class Add_Book(Resource): # For whole application 
    @marshal_with(book_fields) # We are sending all the materials objects that we defined above 
    @auth_required("token")
    
    def get(self):
        all_books = Book.query.all() # table_name.query.all() # we can use filter_by also 
        return all_books 
    
    @auth_required("token")  
    @roles_required("librarian")
    def post(self):
        args = parser.parse_args()
        sec_name = args.get('section_name')
        section = Section.query.filter_by( name = sec_name).first()
        if not section:
            return {"message": "Section not found"}, 404
        #add_book = Book(**args)
        add_book = Book(
            title = args.get('title'),
            author = args.get('author'),
            subtitle = args.get('subtitle'),
            content = args.get('content'),
            image = args.get('image'),
            year = args.get('year'),
            sec_id = section.id
        )
        dbase.session.add(add_book)
        # Before commiting check the required fields , if empty dont commit else commit . For this use required = True in arg section , so we dont have to check hear 
        dbase.session.commit()
        return {"message":"Book Added Sucessfully"}
    

api.add_resource(Add_Book , '/add_book')
