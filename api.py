from flask import Blueprint, request, jsonify
from flask_restful import Api, Resource , reqparse , marshal_with , fields 
from model import dbase, Book, Record , Section , User 
from flask_security import auth_required , roles_required , current_user
from flask_jwt_extended import jwt_required
from flask_security import Security, SQLAlchemyUserDatastore, auth_required , roles_required
from sqlalchemy import or_
from datetime import datetime , date
from model import *

api = Api(prefix='/api')


'''
# Adding New Book
# Creating a request parser / Whenever some one send request it will pass the req object and returns a dictionary 


# Creating fields | Note-> If we remove any field , it will not be sent 
book_fields = {
    "title" : fields.String ,
    "author": fields.String,
    "subtitle": fields.String ,
    "content": fields.String ,
    "image": fields.String,
    "year": fields.Integer,
    "section_id": fields.Integer,
    "section_name": fields.String
}
'''

# For adding and getting Books
class Add_Book(Resource):
    
    parser = reqparse.RequestParser()
    parser.add_argument('title', type = str , help = "book Name invalid type" , required = True )
    parser.add_argument('author', type = str , help = "book author invalid type" , required = True)
    parser.add_argument('subtitle', type = str , help = "book subtitle invalid type" , required = True )
    parser.add_argument('content', type = str , help = "book content invalid type" , required = True)
    parser.add_argument('image', type = str , help = "book image invalid type" , required = True)
    parser.add_argument('year', type = int , help = "book Name invalid type",required = True)
    parser.add_argument('section_name',type=str, required = True , help = "Section Name invalid type")
    
    #@marshal_with(book_fields) # We are sending all the materials objects that we defined above 
    @auth_required("token")
    def get(self):
        books = dbase.session.query(Book, Section).join(Section, Book.sec_id == Section.id).all()
        all_books = []
        for book, section in books:
            all_books.append({
                'title': book.title,
                'author': book.author,
                'subtitle': book.subtitle,
                'content': book.content,
                'image': book.image,
                'year': book.year,
                'section_name': section.name,
                'section_id': section.id
            })
        if len(all_books) > 0:
            return all_books 
        else :
            return ({"message":"No book found"}) , 404
        
    @auth_required("token")  
    @roles_required("librarian")
    def post(self):
        args = self.parser.parse_args()
        sec_name = args.get('section_name')
        section = Section.query.filter_by( name = sec_name).first()
        if not section:
            return {"message": "Section not found"}, 404
        existing_book = Book.query.filter_by(title = args.get('title')).first()
        if existing_book is not None:
            # If the book exists, return a message
            return {"message": "Book already prsent"} , 404
        #add_book = Book(**args)
        add_book = Book(
            title = args.get('title').capitalize(),
            author = args.get('author').capitalize(),
            subtitle = args.get('subtitle').capitalize(),
            content = args.get('content'),
            image = args.get('image'),
            year = args.get('year'),
            sec_id = section.id
        )
        dbase.session.add(add_book)
        # Before commiting check the required fields , if empty dont commit else commit . For this use required = True in arg section , so we dont have to check hear 
        dbase.session.commit()
        return {"message":"Book Added Sucessfully"} , 201
    

# Now create a api for accepting Book request 
class Book_Request(Resource):
    
    user_request_book = reqparse.RequestParser()
    user_request_book.add_argument('user_email', type = str , help = "Invalid Email" , required = True )
    user_request_book.add_argument('book_id', type = int , help = "Invalid book ID" , required = True)
    user_request_book.add_argument('ret_date', type = str , help = "Invalid returning date" , required = True)
        
    @auth_required("token")  
    #@roles_required("librarian")
    def post(self):
        args = self.user_request_book.parse_args()
        user = User.query.filter_by(email = args.get('user_email')).first()
        user_id = user.id 
        book_id = args.get('book_id')
        existing_request = Record.query.filter_by(user_id = user_id , book_id = book_id , status = 'Requested').first()
        #user_book_count = Record.query.filter_by(user_id = user_id , status = "Requested" )
        user_book_count = Record.query.filter_by(user_id=user_id).filter(or_(Record.status == "Requested", Record.status == "Issued")).count()
        
        if existing_request:
            return {"message":"Already requested"} , 409
        if user_book_count > 5:
            return {"message":"You can request limit is completed"} , 404
        
        today_date = date.today()
        ret_date = args.get('ret_date')
        ret_date = datetime.strptime(ret_date, '%Y-%m-%d').date()
        add_record = Record(
            user_id = user_id ,
            book_id = book_id ,
            req_date = today_date,
            ret_date = ret_date,
            status = 'Requested'
        )
        dbase.session.add(add_record)
        dbase.session.commit()
        return {"message":"Request placed sucessfully"} , 201


# Lets create to approve the request
class Approve_Request(Resource):
    
    request_id = reqparse.RequestParser()
    request_id.add_argument('req_id', type = int , help = "Invalid Request ID" , required = True)
    
    @auth_required("token")  
    @roles_required("librarian")
    def post(self):
        args = self.request_id.parse_args()
        req_idd = args.get('req_id')
        req = Record.query.filter_by(id = req_idd).first()
        
        if not req:
            return {"message" : "Request dosent exist"} , 404
        
        req.status = "Issued"
        dbase.session.commit()
        return {"message":"Request Approved"} , 201
        
        
# Lets revoke the access of a book 
class Revoke_Book(Resource):
    
    revoke_id = reqparse.RequestParser()
    revoke_id.add_argument('req_id', type = int , help = "Invalid Request ID" , required = True)  
    
    @auth_required("token")  
    @roles_required("librarian")
    def post(self):
        args = self.revoke_id.parse_args()
        req_id = args.get('req_id')
        revoke = Record.query.filter_by(id = req_id ).first()
        current_status = revoke.status
        # if current_status == "Issued":
        #     return {"message":"Not Issued"} , 409
        if current_status == "Requested":
            return {"message":"Not Issued"}
        revoke.status = "Revoked"
        dbase.session.commit()
        return {"message":"Access revoked"} , 201
 

# Now create route for adding section 
class Add_Section(Resource):
    add_section = reqparse.RequestParser()
    add_section.add_argument('section_name', type = str , help = "Invalid Name" , required = True)

    @auth_required("token")
    def get(self):
        sections = Section.query.all()
        all_sections = []
        for section in sections:
            all_sections.append({
                'id': section.id,
                'name': section.name
            })
        if len(all_sections) > 0:
            return all_sections 
        else :
            return ({"message":"No section found"}) , 404
        
    @auth_required("token")  
    @roles_required("librarian")
    def post(self):
        args = self.add_section.parse_args()
        sec_name = args.get('section_name').capitalize()
        existing_section = Section.query.filter_by(name = sec_name).first()
        
        if existing_section:
            return {"message":"Section already exist"} , 409
        new_section = Section(
            name = sec_name
        )
        dbase.session.add(new_section)
        dbase.session.commit()
        return {"message":"Section added sucessfully"} , 201
         
         
# Route for editing section



# Route for editing existing book 

# Deleting section # Remember to delete all books of that section and delete recode also 

# Deleting book # delete recode 


api.add_resource(Add_Book , '/add_book')
api.add_resource(Book_Request , '/book_request' )
api.add_resource(Approve_Request , '/approve_request' )
api.add_resource(Revoke_Book , '/revoke_book' )
api.add_resource(Add_Section , '/add_section' )
