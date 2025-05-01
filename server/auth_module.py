import bcrypt
import jwt
import datetime
import os
from functools import wraps
from flask import request, jsonify
from db_connection import execute_query

# Get JWT secret from environment or use a default (in production, always use environment variable)
JWT_SECRET = os.getenv('JWT_SECRET', 'Rohan%40220702')
# Token expiration time (1 day)
TOKEN_EXPIRATION = datetime.timedelta(days=1)

def hash_password(password):
    """Hash a password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password, hashed_password):
    """Verify a password against a hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

def generate_token(user_id, email):
    """Generate a JWT token for a user"""
    payload = {
        'exp': datetime.datetime.utcnow() + TOKEN_EXPIRATION,
        'iat': datetime.datetime.utcnow(),
        'sub': user_id,
        'email': email
    }
    return jwt.encode(payload, JWT_SECRET, algorithm='HS256')

def decode_token(token):
    """Decode a JWT token"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None  # Token expired
    except jwt.InvalidTokenError:
        return None  # Invalid token

def register_user(email, password, first_name=None, last_name=None):
    """Register a new user"""
    # Check if user exists
    user = execute_query(
        "SELECT id FROM users WHERE email = %s",
        (email,),
        fetch=True
    )
    
    if user:
        return None, "User with this email already exists"
    
    # Hash the password
    hashed_password = hash_password(password)
    
    # Insert new user
    user_id = execute_query(
        "INSERT INTO users (email, password_hash, first_name, last_name) VALUES (%s, %s, %s, %s)",
        (email, hashed_password, first_name, last_name)
    )
    
    return user_id, None

def login_user(email, password):
    """Login a user"""
    # Get user by email
    users = execute_query(
        "SELECT id, email, password_hash FROM users WHERE email = %s",
        (email,),
        fetch=True
    )
    
    if not users or len(users) == 0:
        return None, "Invalid email or password"
    
    user = users[0]
    
    # Verify password
    if not verify_password(password, user['password_hash']):
        return None, "Invalid email or password"
    
    # Generate token
    token = generate_token(user['id'], user['email'])
    
    return {
        'user_id': user['id'],
        'email': user['email'],
        'token': token
    }, None

def token_required(f):
    """Decorator for routes that require authentication"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Get token from header
        auth_header = request.headers.get('Authorization')
        if auth_header:
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({"error": "Authentication token is missing"}), 401
        
        # Decode token
        payload = decode_token(token)
        if not payload:
            return jsonify({"error": "Invalid or expired token"}), 401
        
        # Add user info to request object
        request.user = {
            'id': payload['sub'],
            'email': payload['email']
        }
        
        return f(*args, **kwargs)
    
    return decorated