# Constitution - Python Console Todo Application

## Purpose
This constitution establishes the fundamental principles and coding standards for the Python console todo application. All development activities must adhere to these principles to ensure code quality, maintainability, and consistency.

## Core Principles

### 1. Clean Code Standards
- **PEP 8 Compliance**: All code must strictly follow PEP 8 style guidelines
- **Type Hints**: Every function, method, and variable must include appropriate type hints
- **Descriptive Naming**: Use meaningful variable and function names that clearly indicate their purpose
- **Maximum Line Length**: Limit lines to 88 characters maximum
- **Consistent Formatting**: Maintain consistent indentation and spacing throughout the codebase

### 2. Storage Constraints
- **In-Memory Only**: The application must utilize in-memory storage only (Python dictionaries, lists, or sets)
- **No External Databases**: Prohibited from using SQLite, PostgreSQL, MySQL, or any external database systems
- **Session-Based Data**: All data persists only for the duration of the application session

### 3. Architecture & Separation of Concerns
- **Model Layer**: Contains data structures and business logic (models.py)
- **Controller Layer**: Handles application logic and coordination (todo_manager.py)
- **View Layer**: Manages user interface and input/output operations (main.py, utils.py)
- **Clear Boundaries**: Each layer must have well-defined responsibilities with minimal overlap
- **Loose Coupling**: Components should be loosely coupled to promote modularity

### 4. Function Design Standards
- **Maximum Length**: No function should exceed 20 lines of code
- **Single Responsibility**: Each function should perform one specific task
- **Readability**: Functions should be easily readable and understandable
- **Complexity Management**: Break down complex logic into smaller, focused functions

### 5. Documentation Requirements
- **Mandatory Docstrings**: Every function, class, and module must include comprehensive docstrings
- **Format**: Use Google-style or Sphinx-style docstrings consistently
- **Content**: Docstrings must describe purpose, parameters, return values, and exceptions
- **Updates**: Keep docstrings synchronized with code changes

### 6. Feature Set - Basic Level Operations
The application must support the following core operations:
- **Add Task**: Create new tasks with title and optional description
- **Delete Task**: Remove tasks from the todo list
- **Update Task**: Modify existing task details
- **View Tasks**: Display all tasks or filtered subsets
- **Mark Complete**: Update task completion status
- **Input Validation**: Validate all user inputs with appropriate error handling

### 7. Package Management
- **UV Package Manager**: Use UV as the exclusive package manager for all dependencies
- **UV Virtual Environments**: Create and manage virtual environments using UV
- **Dependency Management**: Maintain dependencies through UV commands only
- **Requirements**: Document dependencies in requirements.txt using UV-generated lock files

### 8. Error Handling
- **Robust Input Validation**: Validate all user inputs and provide friendly error messages
- **Graceful Degradation**: Handle edge cases and unexpected inputs gracefully
- **User-Friendly Messages**: Display clear, actionable error messages to users
- **Exception Management**: Properly catch and handle exceptions without crashing the application

### 9. Testing Considerations
- **Testable Code**: Write code that is easily testable with unit tests
- **Modular Functions**: Keep functions small and focused for easier testing
- **Separation of Logic**: Separate pure logic from I/O operations for better testability

## Enforcement
All contributors must review and adhere to this constitution. Code reviews will verify compliance with these standards before accepting changes into the codebase.