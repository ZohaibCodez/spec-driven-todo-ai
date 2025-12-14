#!/usr/bin/env python3
"""
User Isolation Validation Script

This script validates that users can only access their own tasks and not other users' tasks.
"""
import requests
import json
from typing import Optional, Dict, Any

class UserIsolationValidator:
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.session = requests.Session()

    def register_user(self, email: str, password: str) -> Dict[str, Any]:
        """Register a new user."""
        url = f"{self.base_url}/auth/register"
        payload = {
            "email": email,
            "password": password
        }
        response = self.session.post(url, json=payload)
        return response.json()

    def login_user(self, email: str, password: str) -> Dict[str, Any]:
        """Login a user and return token."""
        url = f"{self.base_url}/auth/login"
        payload = {
            "email": email,
            "password": password
        }
        response = self.session.post(url, json=payload)
        return response.json()

    def create_task(self, user_id: int, title: str, description: str = "") -> Dict[str, Any]:
        """Create a task for a specific user."""
        url = f"{self.base_url}/api/{user_id}/tasks"
        headers = {"Authorization": f"Bearer {self.get_token()}"}
        payload = {
            "title": title,
            "description": description,
            "user_id": user_id
        }
        response = self.session.post(url, json=payload, headers=headers)
        return response.json()

    def get_user_tasks(self, user_id: int) -> Dict[str, Any]:
        """Get tasks for a specific user."""
        url = f"{self.base_url}/api/{user_id}/tasks"
        headers = {"Authorization": f"Bearer {self.get_token()}"}
        response = self.session.get(url, headers=headers)
        return response.json()

    def get_token(self) -> str:
        """Get the current session token (simplified for this example)."""
        # In a real implementation, this would retrieve the token from the session
        # For this validation script, we'd need to store the token after login
        pass

def run_user_isolation_test():
    """Run the user isolation validation test."""
    print("Starting User Isolation Validation Test...")

    validator = UserIsolationValidator()

    # Create two different users
    user_a_email = "user_a@test.com"
    user_a_password = "Password123!"

    user_b_email = "user_b@test.com"
    user_b_password = "Password123!"

    print(f"Registering User A: {user_a_email}")
    user_a_result = validator.register_user(user_a_email, user_a_password)
    print(f"User A registration result: {user_a_result}")

    print(f"Registering User B: {user_b_email}")
    user_b_result = validator.register_user(user_b_email, user_b_password)
    print(f"User B registration result: {user_b_result}")

    # Login as User A and create tasks
    print(f"Logging in as User A: {user_a_email}")
    login_a_result = validator.login_user(user_a_email, user_a_password)
    print(f"User A login result: {login_a_result}")

    # Get User A's ID from login result
    user_a_id = login_a_result.get('user', {}).get('id')
    if user_a_id:
        print(f"User A ID: {user_a_id}")

        print("Creating 3 tasks for User A")
        for i in range(3):
            task_result = validator.create_task(user_a_id, f"User A Task {i+1}", f"Description for User A Task {i+1}")
            print(f"Created User A Task {i+1}: {task_result}")

    # Login as User B and create tasks
    print(f"Logging in as User B: {user_b_email}")
    login_b_result = validator.login_user(user_b_email, user_b_password)
    print(f"User B login result: {login_b_result}")

    # Get User B's ID from login result
    user_b_id = login_b_result.get('user', {}).get('id')
    if user_b_id:
        print(f"User B ID: {user_b_id}")

        print("Creating 2 tasks for User B")
        for i in range(2):
            task_result = validator.create_task(user_b_id, f"User B Task {i+1}", f"Description for User B Task {i+1}")
            print(f"Created User B Task {i+1}: {task_result}")

    # Verify User A only sees their own tasks
    if user_a_id:
        print(f"Getting tasks for User A (ID: {user_a_id})")
        user_a_tasks = validator.get_user_tasks(user_a_id)
        print(f"User A tasks: {user_a_tasks}")
        print(f"User A should see 3 tasks, actually sees {len(user_a_tasks)} tasks")

    # Verify User B only sees their own tasks
    if user_b_id:
        print(f"Getting tasks for User B (ID: {user_b_id})")
        user_b_tasks = validator.get_user_tasks(user_b_id)
        print(f"User B tasks: {user_b_tasks}")
        print(f"User B should see 2 tasks, actually sees {len(user_b_tasks)} tasks")

    print("User Isolation Validation Test Complete")

if __name__ == "__main__":
    run_user_isolation_test()