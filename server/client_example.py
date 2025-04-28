import requests
import json

# Base URL for the API
BASE_URL = "http://127.0.0.1:5000"

class BankStatementClient:
    def __init__(self, base_url=BASE_URL):
        self.base_url = base_url
        self.session = requests.Session()  # Use a session to maintain cookies
    
    def register(self, username, email, password):
        """Register a new user"""
        response = self.session.post(
            f"{self.base_url}/register",
            json={
                "username": username,
                "email": email,
                "password": password
            }
        )
        return response.json()
    
    def login(self, username, password):
        """Login with existing credentials"""
        response = self.session.post(
            f"{self.base_url}/login",
            json={
                "username": username,
                "password": password
            }
        )
        return response.json()
    
    def logout(self):
        """Logout the current user"""
        response = self.session.post(f"{self.base_url}/logout")
        return response.json()
    
    def get_profile(self):
        """Get the current user's profile"""
        response = self.session.get(f"{self.base_url}/profile")
        return response.json()
    
    def upload_statement(self, file_path, bank_name, statement_date):
        """Upload and process a bank statement"""
        with open(file_path, "rb") as file:
            files = {"file": file}
            data = {
                "bank_name": bank_name,
                "statement_date": statement_date
            }
            response = self.session.post(
                f"{self.base_url}/upload", 
                files=files, 
                data=data
            )
        return response.json()
    
    def get_statements(self):
        """Get all statements for the current user"""
        response = self.session.get(f"{self.base_url}/statements")
        return response.json()
    
    def get_statement_details(self, statement_id):
        """Get details for a specific statement"""
        response = self.session.get(f"{self.base_url}/statements/details/{statement_id}")
        return response.json()
    
    def get_transactions(self, category=None, start_date=None, end_date=None):
        """Get transactions with filtering options"""
        params = {}
        if category:
            params["category"] = category
        if start_date:
            params["start_date"] = start_date
        if end_date:
            params["end_date"] = end_date
        
        response = self.session.get(f"{self.base_url}/transactions", params=params)
        return response.json()

# Example usage
if __name__ == "__main__":
    client = BankStatementClient()
    
    # 1. Register a new user
    print("Registering new user...")
    register_result = client.register("testuser", "test@example.com", "password123")
    print(json.dumps(register_result, indent=2))
    
    # Or login with existing credentials
    # print("Logging in...")
    # login_result = client.login("testuser", "password123")
    # print(json.dumps(login_result, indent=2))
    
    # 2. Get user profile
    print("\nGetting user profile...")
    profile = client.get_profile()
    print(json.dumps(profile, indent=2))
    
    # 3. Upload a bank statement
    print("\nUploading bank statement...")
    # Replace with your actual file path
    statement_result = client.upload_statement(
        "path/to/your/bank_statement.pdf",
        "Example Bank",
        "2023-04-01"
    )
    print(f"Statement processed with ID: {statement_result.get('statement_id')}")
    
    # 4. Get all statements
    print("\nGetting all statements...")
    statements = client.get_statements()
    print(json.dumps(statements, indent=2))
    
    # 5. Get details for a specific statement
    if "statement_id" in statement_result:
        print(f"\nGetting details for statement {statement_result['statement_id']}...")
        statement_details = client.get_statement_details(statement_result["statement_id"])
        print(f"Found {len(statement_details.get('transactions', []))} transactions")
        
        # 6. Get transactions filtered by category
        print("\nGetting Food & Dining transactions...")
        food_transactions = client.get_transactions(
            category="Food & Dining",
            start_date="2023-03-01",
            end_date="2023-04-30"
        )
        print(json.dumps(food_transactions, indent=2))
    
    # 7. Logout
    print("\nLogging out...")
    logout_result = client.logout()
    print(json.dumps(logout_result, indent=2))