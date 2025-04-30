import os
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import datetime
import json
from dotenv import load_dotenv
from pathlib import Path
import bcrypt

# Load environment variables
load_dotenv(dotenv_path=Path(".env"))

# MySQL connection settings
username = os.getenv("DB_USERNAME", "rohan")
password = os.getenv("DB_PASSWORD", "Rohan%40220702")  # Make sure this isn't empty if your MySQL requires a password
host = os.getenv("DB_HOST", "localhost:3306")
database = os.getenv("DB_NAME", "bank_statements")

# Print connection details for debugging (remove in production)
print(f"Connecting to MySQL: {username}@{host}/{database}")

# Create the database URL
DATABASE_URL = f"mysql+pymysql://rohan:Rohan%40220702@localhost:3306/bank_statements"

# Create the engine with explicit charset setting
engine = create_engine(
    DATABASE_URL,
    connect_args={"charset": "utf8mb4"},
    pool_recycle=3600,
    pool_pre_ping=True
)
Session = sessionmaker(bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    username = Column(String(100), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(128), nullable=False)  # Store hashed password
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Relationships
    statements = relationship("Statement", back_populates="user", cascade="all, delete-orphan")
    
class Statement(Base):
    __tablename__ = "statements"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    bank_name = Column(String(100))
    statement_date = Column(DateTime)
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)
    file_name = Column(String(255))
    
    # Relationships
    user = relationship("User", back_populates="statements")
    transactions = relationship("Transaction", back_populates="statement", cascade="all, delete-orphan")
    summary = relationship("SpendingSummary", back_populates="statement", cascade="all, delete-orphan", uselist=False)
    
class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True)
    statement_id = Column(Integer, ForeignKey("statements.id"), nullable=False)
    date = Column(DateTime)
    description = Column(String(500))
    amount = Column(Float)
    transaction_type = Column(String(20))  # credit or debit
    category = Column(String(100))
    
    # Relationships
    statement = relationship("Statement", back_populates="transactions")

class SpendingSummary(Base):
    __tablename__ = "spending_summaries"
    
    id = Column(Integer, primary_key=True)
    statement_id = Column(Integer, ForeignKey("statements.id"), unique=True, nullable=False)
    # JSON string of all summary data (for backward compatibility and flexible storage)
    summary_data = Column(Text)
    
    # Individual category columns
    utilities = Column(Float, default=0.0)
    food_dining = Column(Float, default=0.0)
    travel_transportation = Column(Float, default=0.0)
    subscriptions = Column(Float, default=0.0)
    loans_emi = Column(Float, default=0.0)
    shopping = Column(Float, default=0.0)
    healthcare = Column(Float, default=0.0)
    miscellaneous = Column(Float, default=0.0)
    
    # Relationships
    statement = relationship("Statement", back_populates="summary")
    
    def get_summary_dict(self):
        """Convert the summary data to a dictionary including both JSON and individual columns"""
        # Get the JSON summary for backward compatibility
        json_summary = json.loads(self.summary_data) if self.summary_data else {}
        
        # Add the individual column values
        column_summary = {
            "Utilities": self.utilities,
            "Food & Dining": self.food_dining,
            "Travel & Transportation": self.travel_transportation,
            "Subscriptions": self.subscriptions,
            "EMIs or Loans": self.loans_emi,
            "Shopping": self.shopping,
            "Healthcare": self.healthcare,
            "Miscellaneous": self.miscellaneous
        }
        
        # Return both, with column values taking precedence
        return {**json_summary, **column_summary}

# Helper functions for user authentication
def hash_password(password):
    """Hash a password for storing."""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(stored_password, provided_password):
    """Verify a stored password against one provided by user"""
    return bcrypt.checkpw(provided_password.encode('utf-8'), stored_password.encode('utf-8'))

# Create all tables
def init_db():
    Base.metadata.create_all(engine)

# User management
def register_user(username, email, password):
    """Register a new user with username, email and password"""
    session = Session()
    
    # Check if username or email already exists
    existing_user = session.query(User).filter(
        (User.username == username) | (User.email == email)
    ).first()
    
    if existing_user:
        session.close()
        if existing_user.username == username:
            return None, "Username already exists"
        else:
            return None, "Email already exists"
    
    # Create new user with hashed password
    password_hash = hash_password(password)
    user = User(username=username, email=email, password_hash=password_hash)
    
    try:
        session.add(user)
        session.commit()
        user_id = user.id
        session.close()
        return user_id, "User registered successfully"
    except Exception as e:
        session.rollback()
        session.close()
        return None, f"Error registering user: {str(e)}"

def login_user(username, password):
    """Authenticate a user by username and password"""
    session = Session()
    user = session.query(User).filter_by(username=username).first()
    
    if not user:
        session.close()
        return None, "Invalid username or password"
    
    if verify_password(user.password_hash, password):
        result = {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
        session.close()
        return result, "Login successful"
    else:
        session.close()
        return None, "Invalid username or password"

def get_user(user_id):
    """Get user details"""
    session = Session()
    user = session.query(User).filter_by(id=user_id).first()
    
    if not user:
        session.close()
        return None
        
    result = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "created_at": user.created_at.isoformat()
    }
    session.close()
    return result

def store_statement_data(user_id, bank_name, statement_date, filename, transactions, summary):
    """Store processed statement data in the database"""
    session = Session()
    
    # Create statement record
    statement = Statement(
        user_id=user_id,
        bank_name=bank_name,
        statement_date=statement_date,
        file_name=filename
    )
    session.add(statement)
    session.flush()  # This populates the statement.id
    
    # Store transactions
    for txn in transactions:
        # Convert date string to datetime if it's a string
        txn_date = txn["date"]
        if isinstance(txn_date, str):
            try:
                txn_date = datetime.datetime.strptime(txn_date, "%Y-%m-%d")
            except ValueError:
                # If date parsing fails, use current date
                txn_date = datetime.datetime.utcnow()
        
        transaction = Transaction(
            statement_id=statement.id,
            date=txn_date,
            description=txn["description"],
            amount=float(txn["amount"]),
            transaction_type=txn["type"],
            category=txn.get("category", "Miscellaneous")
        )
        session.add(transaction)
    
    # Extract values for individual category columns
    utilities = summary.get("Utilities", 0.0)
    food_dining = summary.get("Food & Dining", 0.0)
    travel_transportation = summary.get("Travel & Transportation", 0.0)
    subscriptions = summary.get("Subscriptions", 0.0)
    loans_emi = summary.get("EMIs or Loans", 0.0)
    shopping = summary.get("Shopping", 0.0)
    healthcare = summary.get("Healthcare", 0.0)
    miscellaneous = summary.get("Miscellaneous", 0.0)
    
    # Store summary with individual columns
    summary_record = SpendingSummary(
        statement_id=statement.id,
        summary_data=json.dumps(summary),
        utilities=utilities,
        food_dining=food_dining,
        travel_transportation=travel_transportation,
        subscriptions=subscriptions,
        loans_emi=loans_emi,
        shopping=shopping,
        healthcare=healthcare,
        miscellaneous=miscellaneous
    )
    session.add(summary_record)
    
    session.commit()
    statement_id = statement.id
    session.close()
    
    return statement_id

def get_user_statements(user_id):
    """Get all statements for a user"""
    session = Session()
    statements = session.query(Statement).filter_by(user_id=user_id).all()
    result = []
    
    for stmt in statements:
        result.append({
            "id": stmt.id,
            "bank_name": stmt.bank_name,
            "statement_date": stmt.statement_date.isoformat() if stmt.statement_date else None,
            "uploaded_at": stmt.uploaded_at.isoformat(),
            "file_name": stmt.file_name
        })
    
    session.close()
    return result

def get_statement_details(statement_id, user_id=None):
    """Get details for a specific statement including transactions and summary"""
    session = Session()
    
    # If user_id is provided, ensure the statement belongs to that user
    query = session.query(Statement).filter_by(id=statement_id)
    if user_id is not None:
        query = query.filter_by(user_id=user_id)
        
    statement = query.first()
    if not statement:
        session.close()
        return None
    
    # Get transactions
    transactions = []
    for txn in statement.transactions:
        transactions.append({
            "id": txn.id,
            "date": txn.date.isoformat() if txn.date else None,
            "description": txn.description,
            "amount": txn.amount,
            "type": txn.transaction_type,
            "category": txn.category
        })
    
    # Get summary
    summary = {}
    if statement.summary:
        summary = statement.summary.get_summary_dict()
    
    result = {
        "id": statement.id,
        "user_id": statement.user_id,
        "bank_name": statement.bank_name,
        "statement_date": statement.statement_date.isoformat() if statement.statement_date else None,
        "uploaded_at": statement.uploaded_at.isoformat(),
        "file_name": statement.file_name,
        "transactions": transactions,
        "summary": summary
    }
    
    session.close()
    return result

def get_transactions_by_category(user_id, category=None, start_date=None, end_date=None):
    """Get transactions filtered by category and date range"""
    session = Session()
    
    query = session.query(Transaction).join(Statement).filter(Statement.user_id == user_id)
    
    if category:
        query = query.filter(Transaction.category == category)
    
    if start_date:
        if isinstance(start_date, str):
            start_date = datetime.datetime.strptime(start_date, "%Y-%m-%d")
        query = query.filter(Transaction.date >= start_date)
    
    if end_date:
        if isinstance(end_date, str):
            end_date = datetime.datetime.strptime(end_date, "%Y-%m-%d")
        query = query.filter(Transaction.date <= end_date)
    
    transactions = query.all()
    
    result = []
    for txn in transactions:
        result.append({
            "id": txn.id,
            "statement_id": txn.statement_id,
            "date": txn.date.isoformat() if txn.date else None,
            "description": txn.description,
            "amount": txn.amount,
            "type": txn.transaction_type,
            "category": txn.category
        })
    
    session.close()
    return result

# Initialize the database
if __name__ == "__main__":
    init_db()