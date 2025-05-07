import os
from dotenv import load_dotenv
from pathlib import Path
import mysql.connector
from mysql.connector import pooling

# Load environment variables
load_dotenv(dotenv_path=Path(".env"))

# Database configuration
DB_CONFIG = {
    'host': os.getenv('MYSQL_HOST', 'localhost'),
    'user': os.getenv('MYSQL_USER', 'rohan'),
    'password': os.getenv('MYSQL_PASSWORD', 'Rohan%40220702'),
    'database': os.getenv('MYSQL_DATABASE', 'bank_statement_analyzer'),
    'port': int(os.getenv('MYSQL_PORT', 3306))
}

# Create a connection pool
connection_pool = None

def initialize_db_pool():
    global connection_pool
    try:
        # Create a connection pool with 5 connections
        connection_pool = pooling.MySQLConnectionPool(
            pool_name="bank_statement_pool",
            pool_size=5,
            **DB_CONFIG
        )
        print("Database connection pool initialized successfully")
    except mysql.connector.Error as err:
        print(f"Error initializing database connection pool: {err}")
        raise

def get_connection():
    """Get a connection from the pool"""
    if connection_pool is None:
        initialize_db_pool()
    return connection_pool.get_connection()

def execute_query(query, params=None, fetch=False):
    """Execute a query and optionally fetch results"""
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)
    result = None
    
    try:
        cursor.execute(query, params or ())
        
        if fetch:
            result = cursor.fetchall()
        else:
            connection.commit()
            result = cursor.lastrowid
            
    except mysql.connector.Error as err:
        print(f"Database error: {err}")
        connection.rollback()
        raise
    finally:
        cursor.close()
        connection.close()
        
    return result

    
def get_all_statements(user_id=None):
        query = """
            SELECT 
                id, statement_name, file_name, processing_status, 
                bank_name, statement_period, processed_at, created_at
                FROM statements
            """
        params = ()
        if user_id is not None:
            query += " WHERE user_id = %s"
            params = (user_id,)
    
        query += " ORDER BY created_at DESC"
        return execute_query(query, params=params, fetch=True)