from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import datetime
from enhanced_processor import BankStatementProcessor
from auth_module import register_user, login_user, token_required
from db_connection import execute_query, initialize_db_pool

# Create Flask app
app = Flask(__name__)
CORS(app)

# Configure upload folder
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Initialize the database connection pool
initialize_db_pool()

# Initialize the bank statement processor
processor = BankStatementProcessor()

# Auth routes
@app.route("/api/register", methods=["POST"])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    
    user_id, error = register_user(email, password, first_name, last_name)
    
    if error:
        return jsonify({"error": error}), 400
    
    return jsonify({"message": "User registered successfully", "user_id": user_id}), 201

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    
    user_data, error = login_user(email, password)
    
    if error:
        return jsonify({"error": error}), 401
    
    return jsonify(user_data), 200

# Statement processing routes
@app.route("/api/upload", methods=["POST"])
@token_required
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400
    
    statement_name = request.form.get('statement_name', None)
    
    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{datetime.datetime.now().timestamp()}_{filename}")
    
    try:
        file.save(file_path)
        
        # Get user ID from token
        user_id = request.user['id']
        
        # Process the file
        result = processor.process_file(file_path, user_id, statement_name)
        
        # Clean up the file
        os.remove(file_path)
        
        return jsonify(result)
    
    except Exception as e:
        # Clean up the file if it exists
        if os.path.exists(file_path):
            os.remove(file_path)
        
        return jsonify({"error": str(e)}), 500

@app.route("/api/statements", methods=["GET"])
@token_required
def get_statements():
    user_id = request.user['id']
    
    statements = execute_query(
        """SELECT id, statement_name, bank_name, statement_period, file_name, 
                 processing_status, processed_at, created_at 
          FROM statements 
          WHERE user_id = %s 
          ORDER BY created_at DESC""",
        (user_id,),
        fetch=True
    )
    
    # Convert datetime objects to strings for JSON serialization
    for statement in statements:
        for key, value in statement.items():
            if isinstance(value, (datetime.datetime, datetime.date)):
                statement[key] = value.isoformat()
    
    return jsonify({"statements": statements})

@app.route("/api/statements/<int:statement_id>", methods=["GET"])
@token_required
def get_statement_details(statement_id):
    user_id = request.user['id']
    
    # Verify statement belongs to user
    statement = execute_query(
        """SELECT id, statement_name, bank_name, statement_period, file_name, 
                 processing_status, processed_at, created_at 
          FROM statements 
          WHERE id = %s AND user_id = %s""",
        (statement_id, user_id),
        fetch=True
    )
    
    if not statement:
        return jsonify({"error": "Statement not found"}), 404
    
    statement = statement[0]
    
    # Get transactions
    transactions = execute_query(
        """SELECT t.id, t.date, t.description, t.amount, t.type, c.name as category 
          FROM transactions t
          JOIN categories c ON t.category_id = c.id
          WHERE t.statement_id = %s
          ORDER BY t.date DESC""",
        (statement_id,),
        fetch=True
    )
    
    # Get spending summary
    summary = execute_query(
        """SELECT c.name as category, s.total_amount 
          FROM spending_summaries s
          JOIN categories c ON s.category_id = c.id
          WHERE s.statement_id = %s
          ORDER BY s.total_amount DESC""",
        (statement_id,),
        fetch=True
    )
    
    # Convert datetime objects to strings for JSON serialization
    for key, value in statement.items():
        if isinstance(value, (datetime.datetime, datetime.date)):
            statement[key] = value.isoformat()
    
    for transaction in transactions:
        for key, value in transaction.items():
            if isinstance(value, (datetime.datetime, datetime.date)):
                transaction[key] = value.isoformat()
    
    return jsonify({
        "statement": statement,
        "transactions": transactions,
        "summary": summary
    })

@app.route("/api/categories", methods=["GET"])
@token_required
def get_categories():
    categories = execute_query(
        "SELECT id, name, description FROM categories",
        fetch=True
    )
    
    return jsonify({"categories": categories})

if __name__ == "__main__":
    app.run(debug=True)