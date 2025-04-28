import requests
import json
from datetime import datetime

# Set the base URL for your Flask app
BASE_URL = "http://127.0.0.1:5000"

def upload_statement(file_path, bank_name, statement_date):
    """Upload and process a bank statement"""
    with open(file_path, "rb") as file:
        files = {"file": file}
        data = {
            "bank_name": bank_name,
            "statement_date": statement_date
        }
        response = requests.post(
            f"{BASE_URL}/upload", 
            files=files, 
            data=data,
            # Include cookies to maintain session
            cookies=requests.cookies.RequestsCookieJar()
        )
        # Save the cookies for future requests
        cookies = response.cookies
    return response.json(), cookies

def get_user_statements(cookies):
    """Get all statements for the current user"""
    response = requests.get(
        f"{BASE_URL}/statements",
        cookies=cookies
    )
    return response.json()

def get_statement_details(statement_id, cookies):
    """Get details for a specific statement"""
    response = requests.get(
        f"{BASE_URL}/statements/details/{statement_id}",
        cookies=cookies
    )
    return response.json()

def get_transactions(category=None, start_date=None, end_date=None, cookies=None):
    """Get transactions filtered by category and date range"""
    params = {}
    if category:
        params["category"] = category
    if start_date:
        params["start_date"] = start_date
    if end_date:
        params["end_date"] = end_date
    
    response = requests.get(
        f"{BASE_URL}/transactions", 
        params=params,
        cookies=cookies
    )
    return response.json()

def get_profile(cookies):
    """Get user profile information"""
    response = requests.get(
        f"{BASE_URL}/profile",
        cookies=cookies
    )
    return response.json()

# Example usage
if __name__ == "__main__":
    # 1. Upload a statement - This will create a user automatically
    statement_result, cookies = upload_statement(
        "path/to/bank_statement.pdf",
        "Example Bank",
        "2023-04-01"
    )
    print("Statement processed:", statement_result)
    statement_id = statement_result["statement_id"]
    
    # 2. Get profile information
    profile = get_profile(cookies)
    print("User profile:", profile)
    
    # 3. Get all statements for the user
    statements = get_user_statements(cookies)
    print("User statements:", statements)
    
    # 4. Get details for a specific statement
    details = get_statement_details(statement_id, cookies)
    print("Statement details:", details)
    
    # 5. Get transactions by category
    food_transactions = get_transactions(
        category="Food & Dining",
        start_date="2023-03-01",
        end_date="2023-04-30",
        cookies=cookies
    )
    print("Food & Dining transactions:", food_transactions)