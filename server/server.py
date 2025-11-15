from flask import Flask,request, jsonify, session
from models import db,User,Tasks
from flask_bcrypt import Bcrypt
from datetime import datetime
from flask_moment import Moment
from flask_marshmallow import Marshmallow
#Initialize the app
app = Flask(__name__)

#Configurations
app.config['SECRET_KEY'] = "The Best Team Ever"
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///App.db'
SQLALHEMY_TRACK_MODIFICATIONS = False
SQLALHEMY_ECHO = True

moment = Moment()
ma = Marshmallow(app)
db.init_app(app)
moment.init_app(app)
bcrypt  = Bcrypt(app)

with app.app_context():
    db.create_all() #Create the db



class TasksSchema(ma.Schema):
    class Meta:
        fields = ('id', 'title', 'body', 'location','tokens','timestamp')

tasks_schema = TasksSchema(many=True)


#signup route
@app.route("/signup", methods = ['POST'])
def signup():
    #Get the requests from the react
    email = request.json["email"]
    username = request.json["username"]
    password = request.json["password"]
    
    #Query if the user is already sign-up
    is_user_exists = User.query.filter_by(email=email).first() is not None 
    if is_user_exists:
        return jsonify({'error': "This user is already exists" }),409
    
    #make the password hashed for more secure
    hased_password = bcrypt.generate_password_hash(password)
    #Define the new user in data base
    new_user = User(email = email, password = hased_password, username = username)
    db.session.add(new_user) #Adding user in db
    db.session.commit() #Commit the changes

    session['user_id'] = new_user.id #Cookies will keep the credentials for the user
    
    return jsonify({ #Return the user informations
        "id":new_user.id,
        "email": new_user.email,
        "username": new_user.username,
    })


@app.route("/login",methods=['POST'])
def login():
    is_email = False

    #Get the requests
    email = request.json['email']
    password = request.json['password']

    #Check if the the input is email or username
    for i in email:
        if i == '@':
            is_email = True
            break
   
   #if it is an email Query with emails
    if is_email == True:
        user = User.query.filter_by(email =email).first()
        print("OK")
    else: #If not query with the name
        user = User.query.filter_by(username = email).first()
    
    if user is None: 
        return jsonify({'error': "Unauthorized Access"}),401
    
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({'error': "Unauthorized or Wrong password"})
    
    session["user_id"] = user.id
    
    return jsonify({
        "id": user.id,
        "email": user.email,
        "tokens": user.tokens
    })


@app.route("/get",methods =['GET','POST'])
def index():
    tasks = Tasks.query.order_by(Tasks.timestamp.desc()).all
    if tasks is None:
        return jsonify({"error":"No available tasks"}),404
    results = tasks_schema.dump(tasks)
    return jsonify(results)



if __name__ == '__main__':
    app.run(host = '0.0.0.0',port =5000, debug = True)