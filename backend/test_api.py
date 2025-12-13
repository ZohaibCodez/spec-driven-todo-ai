"""
Test script to validate the Task Management API functionality
"""
import requests
import json
from datetime import datetime

# Base URL for the API (assuming it's running locally)
BASE_URL = "http://localhost:8000/api"

def test_api():
    print("Testing Task Management API...")

    # Test 1: Create a task
    print("\n1. Testing POST /tasks (Create Task)")
    task_data = {
        "title": "Test Task",
        "description": "This is a test task",
        "completed": False
    }

    response = requests.post(f"{BASE_URL}/tasks", json=task_data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

    if response.status_code == 201:
        task_id = response.json()["id"]
        print(f"Created task with ID: {task_id}")
    else:
        print("Failed to create task")
        return

    # Test 2: Get the created task
    print(f"\n2. Testing GET /tasks/{task_id} (Get Task)")
    response = requests.get(f"{BASE_URL}/tasks/{task_id}")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

    # Test 3: Update the task
    print(f"\n3. Testing PUT /tasks/{task_id} (Update Task)")
    update_data = {
        "title": "Updated Test Task",
        "description": "This is an updated test task",
        "completed": True
    }

    response = requests.put(f"{BASE_URL}/tasks/{task_id}", json=update_data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

    # Test 4: Toggle completion status
    print(f"\n4. Testing PATCH /tasks/{task_id}/complete (Toggle Completion)")
    response = requests.patch(f"{BASE_URL}/tasks/{task_id}/complete")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

    # Test 5: Get all tasks
    print(f"\n5. Testing GET /tasks (Get All Tasks)")
    response = requests.get(f"{BASE_URL}/tasks")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

    # Test 6: Delete the task
    print(f"\n6. Testing DELETE /tasks/{task_id} (Delete Task)")
    response = requests.delete(f"{BASE_URL}/tasks/{task_id}")
    print(f"Status Code: {response.status_code}")
    if response.status_code == 204:
        print("Task deleted successfully")

    print("\nAll tests completed successfully!")

if __name__ == "__main__":
    test_api()