<!-- SYNC IMPACT REPORT:
Version change: N/A (initial) → 1.0.0
Modified principles: N/A
Added sections: All principles added for Python console todo app
Removed sections: N/A
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ updated
  - .specify/templates/spec-template.md ✅ updated
  - .specify/templates/tasks-template.md ✅ updated
  - .specify/templates/commands/*.md ✅ reviewed
Follow-up TODOs: None
-->
# Todo Console App Constitution

## Core Principles

### Clean Code with Type Hints and PEP 8 Compliance
All code must adhere to PEP 8 standards and include comprehensive type hints. Functions must be clear, readable, and maintainable with consistent formatting. This ensures code quality, reduces bugs, and improves team collaboration.

### In-Memory Storage Only
The application must use in-memory data structures only, with no external database dependencies. Data persistence is limited to session lifetime, ensuring simplicity and avoiding database complexity. This approach keeps the application lightweight and portable.

### Separation of Concerns
The codebase must maintain clear separation between data layer, business logic layer, and UI layer. Each layer has distinct responsibilities: data layer handles storage/retrieval, logic layer manages operations, and UI layer handles user interaction. This promotes modularity and testability.

### Function Length Limit
No function may exceed 20 lines of code. Complex operations must be broken down into smaller, focused functions. This improves readability, makes debugging easier, and enforces single responsibility principle.

### Documentation Requirement
Every function must include a comprehensive docstring explaining its purpose, parameters, return values, and exceptions raised. This ensures maintainability and enables other developers to understand and extend the codebase effectively.

### Basic Features Only
Implementation is restricted to core todo operations: Add, Delete, Update, View, and Mark Complete. No advanced features like categorization, due dates, or notifications are allowed. This maintains simplicity and focuses on essential functionality.

## Technology Stack
The project operates within a virtual environment managed by the uv Python package manager. All dependencies must be compatible with uv and specified in appropriate configuration files. Python 3.8+ is required for type hint features.

## Development Standards
Code must pass all linting checks (flake8, mypy) before merging. Unit tests must cover all functions with minimum 80% code coverage. Functions should handle edge cases gracefully and validate input parameters appropriately.

## Governance
This constitution governs all development activities for the Todo Console App. All pull requests must comply with these principles before approval. Changes to this constitution require explicit approval from project maintainers and must include a migration plan for existing code.

**Version**: 1.0.0 | **Ratified**: 2025-12-13 | **Last Amended**: 2025-12-13