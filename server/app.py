from flask import Flask, request, jsonify, session
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import uuid
from datetime import datetime, timedelta
from bank_statement_processor import BankStatementProcessor
import database as db

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = os.getenv("SECRET_KEY", os.urandom(24).hex())  # For session management

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production with HTTPS
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=30)

processor = BankStatementProcessor()

# Initialize database
db.init_db()

# User authentication endpoints
@app.route("/register", methods=["POST"])
def register():
    """Register a new user"""
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    
    if not username or not email or not password:
        return jsonify({"error": "Username, email, and password are required"}), 400
    
    user_id, message = db.register_user(username, email, password)
    
    if user_id:
        # Set up session
        session['user_id'] = user_id
        session.permanent = True
        return jsonify({
            "message": message,
            "user_id": user_id
        })
    else:
        return jsonify({"error": message}), 400

@app.route("/login", methods=["POST"])
def login():
    """Login an existing user"""
    data = request.json
    username = data.get("username")
    password = data.get("password")
    
    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400
    
    user, message = db.login_user(username, password)
    
    if user:
        # Set up session
        session['user_id'] = user["id"]
        session.permanent = True
        return jsonify({
            "message": message,
            "user": user
        })
    else:
        return jsonify({"error": message}), 401

@app.route("/logout", methods=["POST"])
def logout():
    """Logout the current user"""
    session.pop('user_id', None)
    return jsonify({"message": "Logged out successfully"})

# Auth middleware to check if user is logged in
def auth_required(func):
    def wrapper(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({"error": "Authentication required"}), 401
        return func(*args, **kwargs)
    wrapper.__name__ = func.__name__
    return wrapper

@app.route("/profile", methods=["GET"])
@auth_required
def get_profile():
    """Get the profile of the current user"""
    user_id = session.get('user_id')
    user = db.get_user(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user)

@app.route("/upload", methods=["POST"])
# @auth_required
def upload_file():
    """Upload and process a bank statement"""
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400
    
    # Get form data
    bank_name = request.form.get("bank_name", "Unknown Bank")
    statement_date_str = request.form.get("statement_date")
    
    # Get user_id from session
    user_id = session.get('user_id')
    
    statement_date = None
    if statement_date_str:
        try:
            statement_date = datetime.strptime(statement_date_str, "%Y-%m-%d")
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400
    
    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)
    
    try:
        # Process the file
        result = processor.process_file(file_path)
        
        # Store in database
        statement_id = db.store_statement_data(
            user_id=user_id,
            bank_name=bank_name,
            statement_date=statement_date,
            filename=filename,
            transactions=result["transactions"],
            summary=result["summary"]
        )
        
        # Add statement_id to the result
        result["statement_id"] = statement_id
        
        # Clean up the file
        os.remove(file_path)
        
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/statements", methods=["GET"])
@auth_required
def get_user_statements():
    """Get all statements for the current user"""
    user_id = session.get('user_id')
    try:
        statements = db.get_user_statements(user_id)
        return jsonify({"statements": statements})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/statements/details/<statement_id>", methods=["GET"])
@auth_required
def get_statement_details(statement_id):
    """Get details for a specific statement"""
    user_id = session.get('user_id')
    try:
        details = db.get_statement_details(int(statement_id), user_id)
        if not details:
            return jsonify({"error": "Statement not found or access denied"}), 404
        return jsonify(details)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/transactions", methods=["GET"])
@auth_required
def get_transactions():
    """Get transactions with filtering options"""
    user_id = session.get('user_id')
    category = request.args.get("category")
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")
    
    try:
        transactions = db.get_transactions_by_category(
            user_id=user_id,
            category=category,
            start_date=start_date,
            end_date=end_date
        )
        return jsonify({"transactions": transactions})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)