from flask import Flask,request, jsonify, session
from models import db,User,Tasks
from flask_bcrypt import Bcrypt
from datetime import datetime
from flask_moment import Moment
from flask_marshmallow import Marshmallow
from marshmallow import fields,validate
from functools import wraps
from flask_cors import CORS




#Initialize the app
app = Flask(__name__)
CORS(app, supports_credentials=True, origins="*") 

#Configurations
app.config['SECRET_KEY'] = "The Best Team Ever"
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///App.db'
SQLALHEMY_TRACK_MODIFICATIONS = False
SQLALHEMY_ECHO = True
moment = Moment()
ma = Marshmallow(app)
db.init_app(app)
moment.init_app(app)
bcrypt = Bcrypt(app)

with app.app_context():
    db.create_all() #Create the db





class TasksSchema(ma.Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    body = fields.Str(required=True)
    location = fields.Str(required=True)
    tokens = fields.Int()
    timestamp = fields.DateTime(dump_only=True)
    is_admin = fields.Bool(dump_only=True)
    class Meta:
        fields = ('id', 'title', 'body', 'location','tokens','timestamp','is_admin')

tasks_schema = TasksSchema(many=True)
task_schema = TasksSchema()



def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Authentication required'}), 401

        user = User.query.get(user_id)
        if not user or not user.is_admin:
            return jsonify({'error': 'Admin access required'}), 403
    
        return f(*args, **kwargs)
    return decorated_function




#signup route
@app.route("/signup", methods = ['POST'])
def signup():
    # Get JSON data safely
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Missing JSON in request'}), 400

    #Get the requests from the react
    email = data.get("email")
    username = data.get("username")
    password = data.get("password")

    if not email or not username or not password:
        return jsonify({'error': "Missing required fields (email, username, password)" }), 400

    #Query if the user is already sign-up
    is_user_exists = User.query.filter_by(email=email).first() is not None 
    if is_user_exists:
        return jsonify({'error': "This user is already exists" }),409

    #make the password hashed for more secure
    hased_password = bcrypt.generate_password_hash(password)
    #Define the new user in data base
    if email == 'admin@gmail.com' and username == "admin" and password == "admin":
        new_user = User(email = email, password = hased_password, username = username, is_admin = True)
    else:
        new_user = User(email = email, password = hased_password, username=username)
    db.session.add(new_user) #Adding user in db
    db.session.commit() #Commit the changes

    session['user_id'] = new_user.id #Cookies will keep the credentials for the user

    return jsonify({ #Return the user informations
        "id":new_user.id,
        "email": new_user.email,
        "username": new_user.username,
    })


@app.route("/login",methods=['POST','GET'])
def login():
    print("Login request received")
    # Safely get JSON data
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Missing JSON data in request body'}), 400

    is_email = False

     # Use .get() to safely retrieve the data, preventing KeyError
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Missing email/username or password field'}), 400

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
        return jsonify({'error': "Unauthorized or Wrong password"}), 401

    session["user_id"] = user.id
 
    return jsonify({
        "id": user.id,
        "email": user.email,
        "tokens": user.tokens
    })


@app.route("/get",methods =['GET','POST'])
def index():
    tasks = Tasks.query.order_by(Tasks.timestamp.desc()).all()
    if tasks is None:
        return jsonify({"error":"No available tasks"}),404
    results = tasks_schema.dump(tasks)
    return jsonify(results)


@app.route("/create_tasks", methods = ['GET','POST'])
@admin_required
def create_tasks():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Missing JSON data in request body'}), 400
    title = data.get('title')
    body = data.get('body')
    location = data.get('location')
    tokens = data.get('tokens')
    if not title or not body or not location or tokens is None:
        return jsonify({'error': 'Missing required fields for task creation'}), 400

    task = Tasks(title = title, body = body, location = location, tokens=tokens)
    db.session.add(task)
    db.session.commit()
    return jsonify({
        "id":task.id,
        "title": task.title,
        "body":task.body,
        "tokens":task.tokens,
        "location":task.location,
        "timestamp": task.timestamp
    })
if __name__ == '__main__':
    app.run(host = '0.0.0.0',port =5000, debug = True)