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

## Create api for returning book by the user 
## User can cancle the request also 

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
                'id':book.id,
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
class Edit_Section(Resource):
    edit_section = reqparse.RequestParser()
    edit_section.add_argument('section_name', type = str , help = "Invalid Section Name" , required = True)
    edit_section.add_argument('section_id', type = int , help = "Invalid Section ID" , required = True)

    @auth_required("token")
    @roles_required("librarian")
    def post(self):
        args = self.edit_section.parse_args()
        section_name = args.get('section_name')
        section_id = args.get('section_id')
        sec = Section.query.filter_by(id = section_id ).first()
        if sec is None:
            return {"message":"No section found"} , 404
        existing_sec = Section.query.filter_by(name = section_name).first()
        if existing_sec:
            return {"message":"Section already exist"} , 409
        
        sec.name = section_name
        dbase.session.commit()
        return {"message":"Section edited sucessfully"} , 201
        
# Route for editing existing book ## Section id deal with that 
class Edit_Book(Resource):
    edit_book = reqparse.RequestParser()
    edit_book.parser = reqparse.RequestParser()
    edit_book.add_argument('book_id', type=int, help="Invalid Book ID", required=True)
    edit_book.add_argument('title', type=str, help="Title of the book", required=True)
    edit_book.add_argument('author', type=str, help="Author of the book", required=True)
    edit_book.add_argument('subtitle', type=str, help="Subtitle of the book", required=True)
    edit_book.add_argument('sec_id', type=int, help="Section ID of the book", required=True)
    edit_book.add_argument('content', type=str, help="Content of the book", required=True)
    edit_book.add_argument('image', type=str, help="Image URL of the book", required=True)
    edit_book.add_argument('year', type=int, help="Publication year of the book", required=True)
    
    @auth_required("token") 
    @roles_required("librarian")  
    def post(self):
        args = self.edit_book.parse_args()
        book_id = args.get('book_id')
        book = Book.query.filter_by(id=book_id).first()
        
        if not book:
            return {"message": "Book not found"} , 404
        
        book.title = args.get('title')
        book.author = args.get('author')
        book.subtitle = args.get('subtitle')
        book.sec_id = args.get('sec_id')
        book.content = args.get('content')
        book.image = args.get('image')
        book.year = args.get('year')
        dbase.session.commit()
        
        return {"message": "Book details updated successfully"}, 200


# Deleting section # Remember to delete all books of that section and delete recode also 
class Delete_Section(Resource):
    delete_section = reqparse.RequestParser()
    #delete_section.add_argument('section_name', type = str , help = "Invalid Section Name" , required = True)
    delete_section.add_argument('section_id', type = int , help = "Invalid Section ID" , required = True)

    @auth_required("token")
    @roles_required("librarian")
    def post(self):
        args = self.delete_section.parse_args()
        section_id = args.get('section_id')
        section = Section.query.filter_by(id = section_id).first()
        existing_book_with_section_id = Book.query.filter_by(sec_id = section_id).all()
        #existing_records_with_section_id = Record.query.filter_by(book_id = existing_book_with_section_id).all()
        book_ids = [book.id for book in existing_book_with_section_id] # Contains book id 
        records = Record.query.filter(Record.book_id.in_(book_ids)).all()
        
        for record in records:
            dbase.session.delete(record)
        for book in existing_book_with_section_id:
            dbase.session.delete(book)
            
        if not section :
            return {"message":"No section exist "} , 400
        dbase.session.delete(section)
        dbase.session.commit()
        return {"message":"Section deleted Sucessfully"} , 200
        
        
# Deleting book # delete recode 
class Delete_Book(Resource):
    delete_book = reqparse.RequestParser()
    #delete_section.add_argument('section_name', type = str , help = "Invalid Section Name" , required = True)
    delete_book.add_argument('book_id', type = int , help = "Invalid Book ID" , required = True)

    @auth_required("token")
    @roles_required("librarian")
    def post(self):
        args = self.delete_book.parse_args()
        book_id = args.get('book_id')
        book = Book.query.filter_by(id = book_id).first()
        existing_record = Record.query.filter_by(book_id = book_id).all()
        
        if not book:
            return {"message":"Book dosent exist"} , 400
        
        for record in existing_record:
            dbase.session.delete(record)
        dbase.session.delete(book)
        dbase.session.commit()
        
        return {"message":"Book deleted Sucessfully"} , 200




api.add_resource(Add_Book , '/add_book')
api.add_resource(Book_Request , '/book_request' )
api.add_resource(Approve_Request , '/approve_request' )
api.add_resource(Revoke_Book , '/revoke_book' )
api.add_resource(Add_Section , '/add_section' )
api.add_resource(Edit_Section , '/edit_section' )
api.add_resource(Delete_Section , '/delete_section' )
api.add_resource(Delete_Book , '/delete_book' )
api.add_resource(Edit_Book , '/edit_book' )
