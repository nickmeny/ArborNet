from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4
import datetime
db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

class User(db.Model):
    __tablename__ ='users'
    id = db.Column(db.String(11),primary_key = True, unique = True, default = get_uuid)
    email = db.Column(db.String(150),unique = True)
    password = db.Column(db.Text,nullable=False)
    username = db.Column(db.String(150),unique =True)
    tokens = db.Column(db.Integer, default = 0)
    is_admin = db.Column(db.Boolean, default=False)


class Tasks(db.Model):
    __tablename__ = 'tasks'
    id = db.Column(db.Integer,primary_key = True, unique = True)
    title = db.Column(db.String(100), unique = False)
    body = db.Column(db.Text, unique =False)
    tokens = db.Column(db.Integer, default = 0)
    timestamp = db.Column(db.DateTime, index = True, default = datetime.datetime.now)
    location = db.Column(db.Text, unique = False)
    def __init__(self,title,body,location,tokens):
        self.title= title
        self.body = body
        self.location =location
        self.tokens = tokens 
