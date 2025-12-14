"""
Test script to validate the Authentication System API functionality
"""
import requests
import json
from datetime import datetime

# Base URL for the API (assuming it's running locally)
BASE_URL = "http://localhost:8000/api"
AUTH_URL = "http://localhost:8000/auth"

def test_auth_api():
    print("Testing Authentication System API...")

    # Test 1: Register a new user
    import time
    timestamp = int(time.time())
    email = f"testuser_{timestamp}@example.com"
    print(f"\n1. Testing POST /auth/signup (User Registration) with email: {email}")
    signup_data = {
        "email": email,
        "password": "TestPass123!",
        "confirm_password": "TestPass123!",
        "name": "Test User"
    }

    response = requests.post(f"{AUTH_URL}/signup", json=signup_data)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        auth_response = response.json()
        access_token = auth_response["access_token"]
        user_id = auth_response["user"]["id"]
        print(f"User registered successfully with ID: {user_id}")
        print(f"Access token received: {access_token[:20]}...")
    else:
        print(f"Failed to register user: {response.text}")
        return

    # Test 2: Sign in with the registered user
    print(f"\n2. Testing POST /auth/signin (User Sign In)")
    signin_data = {
        "email": email,
        "password": "TestPass123!"
    }

    response = requests.post(f"{AUTH_URL}/signin", json=signin_data)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        auth_response = response.json()
        access_token = auth_response["access_token"]
        user_id = auth_response["user"]["id"]
        print(f"User signed in successfully with ID: {user_id}")
        print(f"New access token received: {access_token[:20]}...")
    else:
        print(f"Failed to sign in user: {response.text}")
        return

    # Test 3: Create a task for the authenticated user
    print(f"\n3. Testing POST /api/{user_id}/tasks (Create User Task)")
    task_data = {
        "title": "Test Task",
        "description": "This is a test task for the authenticated user",
        "completed": False,
        "user_id": user_id  # This is required for the task creation
    }

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    response = requests.post(f"{BASE_URL}/{user_id}/tasks", json=task_data, headers=headers)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 201:
        task_response = response.json()
        task_id = task_response["id"]
        print(f"Task created successfully with ID: {task_id}")
    else:
        print(f"Failed to create task: {response.text}")
        return

    # Test 4: Get the created task for the user
    print(f"\n4. Testing GET /api/{user_id}/tasks/{task_id} (Get User Task)")
    response = requests.get(f"{BASE_URL}/{user_id}/tasks/{task_id}", headers=headers)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print(f"Task retrieved successfully: {response.json()}")
    else:
        print(f"Failed to retrieve task: {response.text}")

    # Test 5: Update the task
    print(f"\n5. Testing PUT /api/{user_id}/tasks/{task_id} (Update User Task)")
    update_data = {
        "title": "Updated Test Task",
        "description": "This is an updated test task",
        "completed": True
    }

    response = requests.put(f"{BASE_URL}/{user_id}/tasks/{task_id}", json=update_data, headers=headers)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print(f"Task updated successfully: {response.json()}")
    else:
        print(f"Failed to update task: {response.text}")

    # Test 6: Toggle completion status
    print(f"\n6. Testing PATCH /api/{user_id}/tasks/{task_id}/complete (Toggle Task Completion)")
    response = requests.patch(f"{BASE_URL}/{user_id}/tasks/{task_id}/complete", headers=headers)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print(f"Task completion toggled successfully: {response.json()}")
    else:
        print(f"Failed to toggle task completion: {response.text}")

    # Test 7: Get all tasks for the user
    print(f"\n7. Testing GET /api/{user_id}/tasks (Get All User Tasks)")
    response = requests.get(f"{BASE_URL}/{user_id}/tasks", headers=headers)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        tasks = response.json()
        print(f"Retrieved {len(tasks)} tasks for user: {tasks}")
    else:
        print(f"Failed to retrieve user tasks: {response.text}")

    # Test 8: Delete the task
    print(f"\n8. Testing DELETE /api/{user_id}/tasks/{task_id} (Delete User Task)")
    response = requests.delete(f"{BASE_URL}/{user_id}/tasks/{task_id}", headers=headers)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 204:
        print("Task deleted successfully")
    else:
        print(f"Failed to delete task: {response.text}")

    # Test 9: Test logout
    print(f"\n9. Testing POST /auth/logout (User Logout)")
    response = requests.post(f"{AUTH_URL}/logout", headers=headers)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("User logged out successfully")
    else:
        print(f"Logout may not be fully implemented: {response.text}")

    print("\nAuthentication System tests completed!")

if __name__ == "__main__":
    test_auth_api()