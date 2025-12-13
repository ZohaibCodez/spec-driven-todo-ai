# 📋 Spec-Driven Todo Application

<div align="center">

[![Python Version](https://img.shields.io/badge/python-3.12%2B-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104%2B-009688.svg)](https://fastapi.tiangolo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Code Style: Black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

**A modern, full-stack task management system demonstrating specification-driven development methodology**

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Architecture](#-architecture) • [Contributing](#-contributing)

</div>

---

## 🎯 Overview

Spec-Driven Todo AI is a comprehensive task management platform that showcases **specification-first development** principles. The project includes both a CLI tool and a RESTful API backend, built with clean architecture patterns and strict adherence to defined specifications.

### Why This Project?

- **🎓 Educational**: Learn spec-driven development methodology
- **🏗️ Production-Ready**: Built with industry best practices
- **📚 Well-Documented**: Complete specifications, plans, and task breakdowns
- **🔧 Modular**: Separate CLI and API for maximum flexibility
- **⚡ Modern Stack**: FastAPI, SQLModel, Python 3.12+, PostgreSQL

## ✨ Features

### CLI Todo Application
- ✅ **Interactive Menu** - User-friendly terminal interface
- ✅ **Task Management** - Create, read, update, delete tasks
- ✅ **Status Tracking** - Toggle completion status with visual indicators
- ✅ **Input Validation** - Comprehensive error handling and validation
- ✅ **Zero Dependencies** - Uses only Python standard library
- ✅ **Fast & Lightweight** - Optimized for performance

### Backend API (FastAPI)
- 🚀 **RESTful API** - Complete CRUD operations for tasks
- 🗄️ **Database Integration** - PostgreSQL with SQLModel ORM
- 🔒 **Data Validation** - Pydantic schemas for type safety
- 📊 **Auto Documentation** - Interactive API docs (Swagger/ReDoc)
- ⚡ **Async Support** - High-performance async/await operations
- 🌐 **CORS Enabled** - Ready for frontend integration
- 🎯 **Clean Architecture** - Separation of concerns (models, routes, schemas)

## 🚀 Quick Start

### Prerequisites

- **Python 3.12+** (compatible with Python 3.13+)
- **UV Package Manager** (recommended) or pip
- **PostgreSQL** database (for backend API)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/ZohaibCodez/spec-driven-todo-ai.git
cd spec-driven-todo-ai
```

#### 2. Set Up Virtual Environment

**Using UV (Recommended):**
```bash
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv sync
```

**Using pip:**
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -e .
```

### Running the Applications

#### CLI Todo App
```bash
# Run the CLI application
python -m src.cli.main

# Or use the installed command
todo
```

#### Backend API
```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
uv pip install -r requirements.txt

# Set up environment variables (see backend/README.md)
cp .env.example .env  # Edit with your database credentials

# Run the API server
uvicorn main:app --reload

# API will be available at http://localhost:8000
# Interactive docs at http://localhost:8000/docs
```

## Usage Examples

### Example 1: Adding Your First Task
```
=== CLI Todo Application ===
1. Add Task
2. View Tasks
3. Update Task
4. Delete Task
5. Toggle Task Status
6. Exit
============================
Select an option (1-6): 1

--- Add New Task ---
Enter task title (required): Complete project proposal
Enter task description (optional, press Enter to skip): Write and submit the Q4 project proposal to stakeholders
Task added successfully with ID: 1
```

### Example 2: Viewing All Tasks
```
Select an option (1-6): 2

--- All Tasks ---
[ ] ID: 1 - Complete project proposal - Write and submit the Q4 project proposal to stakeholders
[ ] ID: 2 - Buy groceries - Milk, bread, eggs, fruits
```

### Example 3: Updating a Task
```
Select an option (1-6): 3

--- Update Task ---
Enter task ID to update: 1
Current task: [ ] Complete project proposal
Description: Write and submit the Q4 project proposal to stakeholders
Enter new title (current: 'Complete project proposal', press Enter to keep current): Complete Q4 project proposal
Enter new description (current: 'Write and submit the Q4 project proposal to stakeholders', press Enter to keep current): Write, review, and submit the Q4 project proposal to stakeholders by Friday
```

## 📚 Documentation

### Project Structure
```
spec-driven-todo-ai/
├── backend/              # FastAPI backend application
│   ├── main.py          # FastAPI app and endpoints
│   ├── models.py        # SQLModel database models
│   ├── schemas.py       # Pydantic request/response schemas
│   ├── database.py      # Database connection and setup
│   └── routes/          # API route handlers
├── src/                 # CLI application source
│   ├── cli/            # Command-line interface
│   ├── models/         # Data models
│   └── storage/        # Storage layer
├── specs/              # Specification documents
│   ├── constitution.md # Project principles
│   └── 001-*/          # Feature specifications
├── tests/              # Test suite
│   ├── unit/          # Unit tests
│   └── integration/   # Integration tests
└── history/           # Development history
```

### Specification-Driven Development

This project follows a rigorous **spec-first** approach:

1. **Constitution** ([specs/constitution.md](specs/constitution.md))
   - Core principles and coding standards
   - Technology stack decisions
   - Architecture patterns

2. **Feature Specs** ([specs/001-*/](specs/))
   - Detailed feature specifications
   - User stories and acceptance criteria
   - API contracts (OpenAPI)

3. **Implementation Plans** 
   - Task breakdowns
   - Development checklists
   - Progress tracking

### Key Documents
- 📖 [CLI Application Spec](specs/001-cli-todo-app/spec.md)
- 📖 [Backend API Spec](specs/001-backend-api/spec.md)
- 📖 [Constitution](specs/constitution.md)
- 📖 [API Contract](specs/001-backend-api/contracts/task-api.openapi.yaml)

## 🧪 Testing

### Running Tests

```bash
# Run all tests
PYTHONPATH=. python3 -m unittest discover tests/ -v

# Run specific test categories
PYTHONPATH=. python3 -m unittest tests.unit.test_storage.test_task_storage -v
PYTHONPATH=. python3 -m unittest tests.unit.test_cli.test_cli_add_task -v
PYTHONPATH=. python3 -m unittest tests.integration.test_end_to_end -v

# Backend API tests
cd backend
python test_api.py
```

### Test Coverage
- ✅ Unit tests for all storage operations
- ✅ CLI interaction tests
- ✅ Integration tests for end-to-end flows
- ✅ API endpoint tests

## 🏗️ Architecture

### CLI Application Architecture
```
┌─────────────────┐
│   CLI Layer     │  ← User interaction, menu system
├─────────────────┤
│  Storage Layer  │  ← Business logic, task operations
├─────────────────┤
│   Models Layer  │  ← Data structures, validation
└─────────────────┘
```

**Key Principles:**
- **Separation of Concerns**: Clear boundaries between layers
- **Zero Dependencies**: CLI uses only Python standard library
- **Fast Performance**: O(1) operations for all core functions
- **Type Safety**: Full type hints throughout

### Backend API Architecture
```
┌──────────────────┐
│   Routes Layer   │  ← API endpoints, request handling
├──────────────────┤
│  Schemas Layer   │  ← Input validation, serialization
├──────────────────┤
│   Models Layer   │  ← Database models, ORM
├──────────────────┤
│  Database Layer  │  ← PostgreSQL connection
└──────────────────┘
```

**Key Principles:**
- **RESTful Design**: Standard HTTP methods and status codes
- **Async Operations**: FastAPI async/await for performance
- **Type Safety**: Pydantic validation throughout
- **Auto Documentation**: OpenAPI/Swagger generated docs

## 🌟 Usage Examples

### CLI Application

#### Adding Your First Task
```bash
$ python -m src.cli.main

=== CLI Todo Application ===
1. Add Task
2. View Tasks
3. Update Task
4. Delete Task
5. Toggle Task Status
6. Exit
============================
Select an option (1-6): 1

--- Add New Task ---
Enter task title (required): Complete project proposal
Enter task description (optional): Write and submit Q4 proposal
Task added successfully with ID: 1
```

#### Viewing All Tasks
```
Select an option (1-6): 2

--- All Tasks ---
[ ] ID: 1 - Complete project proposal - Write and submit Q4 proposal
[✓] ID: 2 - Buy groceries - Milk, bread, eggs
```

### Backend API

#### Create a Task
```bash
curl -X POST "http://localhost:8000/api/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Deploy to production",
    "description": "Deploy v2.0 to production servers",
    "completed": false
  }'
```

#### Get All Tasks
```bash
curl "http://localhost:8000/api/tasks"
```

#### Toggle Task Completion
```bash
curl -X PATCH "http://localhost:8000/api/tasks/1/complete"
```

See [backend/README.md](backend/README.md) for complete API documentation.

## 🚀 Deployment

### CLI Application
```bash
# Install as a system command
pip install -e .

# Now available system-wide
todo
```

### Backend API

**Local Development:**
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Production:**
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

**Docker (Coming Soon):**
```bash
docker-compose up -d
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Read the Constitution**: Understand project principles in [specs/constitution.md](specs/constitution.md)
2. **Follow Spec-First Approach**: Create specifications before implementation
3. **Write Tests**: All new features require tests
4. **Code Style**: Follow PEP 8, use type hints
5. **Documentation**: Update relevant docs

### Development Process
```bash
# 1. Fork and clone
git clone https://github.com/ZohaibCodez/spec-driven-todo-ai.git

# 2. Create feature branch
git checkout -b feature/amazing-feature

# 3. Make changes with tests
# 4. Run tests
PYTHONPATH=. python3 -m unittest discover tests/ -v

# 5. Commit and push
git commit -m 'Add amazing feature'
git push origin feature/amazing-feature

# 6. Open Pull Request
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [FastAPI](https://fastapi.tiangolo.com/)
- ORM powered by [SQLModel](https://sqlmodel.tiangolo.com/)
- Database hosted on [Neon](https://neon.tech/)
- Inspired by specification-driven development practices

## 📞 Contact & Links

- **GitHub**: [@ZohaibCodez](https://github.com/ZohaibCodez)
- **Project Link**: [https://github.com/ZohaibCodez/spec-driven-todo-ai](https://github.com/ZohaibCodez/spec-driven-todo-ai)
- **Issues**: [Report a bug or request a feature](https://github.com/ZohaibCodez/spec-driven-todo-ai/issues)

---

<div align="center">

**⭐ Star this repo if you find it helpful! ⭐**

Made with 🖤 using Specification-Driven Development

</div>

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository.