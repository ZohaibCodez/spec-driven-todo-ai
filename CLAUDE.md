# 🚀 Hackathon II Todo Application - CLAUDE.md

@AGENTS.md

## 📋 Project Overview

Welcome to the **Hackathon II Todo Application** - a progressive, spec-driven project that evolves through 5 phases from a simple Python console app to a full cloud-native deployment with AI capabilities. The project currently includes a fully functional backend API with CRUD operations built using FastAPI and SQLModel.

### 🎯 Project Vision
A comprehensive todo application that demonstrates modern development practices, from basic CLI functionality to AI-powered workflows and cloud-native deployment patterns.

### 📊 Phase Evolution
- **Phase I** 📟: Python console app (in-memory storage)
- **Phase II** 🌐: Full-stack web app (Next.js + FastAPI + Neon DB) - *Currently implemented*
- **Phase III** 🤖: AI chatbot (OpenAI Agents + MCP)
- **Phase IV** ☸️: Local Kubernetes (Minikube + Helm)
- **Phase V** ☁️: Cloud deployment (DigitalOcean/GKE + Kafka + Dapr)

### 🎯 Spec-Driven Development Approach
This project uses **spec-driven development** methodology with:
- 📄 **AGENTS.md** for agent specifications
- 🛠️ **Spec-KitPlus** for structured development
- 🤖 **Claude Code** for AI-assisted implementation

---

## 🛠️ Technology Stack

### Phase I - Console App
- **Language**: Python 3.12+
- **Architecture**: Three-layer (Models, Storage, CLI)
- **Storage**: In-memory dictionary
- **Dependencies**: Standard library only

### Phase II - Full-Stack Web (Currently Active)
- **Backend Framework**: FastAPI 0.104+
- **ORM**: SQLModel for database operations
- **Database**: Neon Serverless PostgreSQL
- **Environment Management**: python-dotenv
- **Database Driver**: psycopg2-binary
- **ASGI Server**: Uvicorn
- **Frontend**: Next.js 14+ (App Router) - *planned*
- **Auth**: Better Auth (JWT) - *planned*
- **Deployment**: Vercel (frontend), Railway/Deta (backend)

### Phase III - AI Integration
- **AI Framework**: OpenAI Agents
- **MCP**: Model Context Protocol
- **API Gateway**: FastAPI with async endpoints

### Phase IV - Container Orchestration
- **Orchestration**: Kubernetes (Minikube)
- **Packaging**: Helm charts
- **Service Mesh**: Dapr (Distributed Application Runtime)

### Phase V - Cloud Production
- **Platform**: DigitalOcean Kubernetes (DOKS) or Google GKE
- **Messaging**: Apache Kafka
- **Runtime**: Dapr for distributed services
- **Monitoring**: Prometheus + Grafana

---

## 📁 Directory Structure

```
spec-driven-todo-ai/
├── 📁 .specify/                 # Spec-KitPlus configuration
│   ├── 📁 memory/              # Constitution and project memory
│   ├── 📁 scripts/             # Automation scripts
│   │   └── 📁 bash/            # Bash scripts for project management
│   └── 📁 templates/           # Template files for specs, plans, tasks
├── 📁 specs/                   # Spec-driven development artifacts
│   ├── 📁 001-cli-todo-app/   # Phase I specifications
│   │   ├── spec.md            # Feature specification
│   │   ├── plan.md            # Implementation plan
│   │   ├── tasks.md           # Development tasks
│   │   ├── contracts/         # API contracts
│   │   └── checklists/        # Validation checklists
│   └── 📁 001-backend-api/    # Phase II specifications (currently active)
│       ├── spec.md            # Feature specification
│       ├── plan.md            # Implementation plan
│       ├── tasks.md           # Development tasks
│       ├── contracts/         # API contracts
│       ├── data-model.md      # Data model definition
│       ├── research.md        # Research summary
│       ├── quickstart.md      # Quickstart guide
│       └── checklists/        # Validation checklists
├── 📁 backend/                 # FastAPI backend implementation
│   ├── main.py                # FastAPI app entry point
│   ├── models.py              # SQLModel database models
│   ├── database.py            # Database connection setup
│   ├── schemas.py             # Pydantic request/response models
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables template
│   ├── .gitignore             # Git ignore file
│   ├── README.md              # Project documentation
│   ├── test_api.py            # API validation test script
│   ├── validate_setup.py      # Setup validation script
│   └── 📁 routes/             # API route definitions
│       └── tasks.py           # Task CRUD endpoints
├── 📁 frontend/               # Next.js application (planned)
│   └── ...
├── 📁 ai/                     # AI agents and MCP (Phase III+)
│   └── ...
├── 📁 k8s/                    # Kubernetes manifests (Phase IV+)
│   └── ...
├── 📁 history/                # Prompt history records
│   └── 📁 prompts/
│       └── 📁 001-backend-api/
├── 📁 tests/                  # Test files (planned)
├── .gitignore                 # Git ignore file
├── .env                       # Environment variables
├── CLAUDE.md                  # This file
├── AGENTS.md                  # Agent specifications
├── pyproject.toml             # Python configuration
├── README.md                  # Project documentation
└── package.json               # Frontend dependencies (planned)
```

---

## 📐 Coding Conventions

### 🏗️ Architecture Principles
1. **Separation of Concerns**: Clear boundaries between models, routes, and services
2. **Spec-First**: All features start with specifications
3. **Test-Driven**: Write tests before implementation
4. **Security-First**: Authentication and validation at every layer

### 📝 Code Standards
- **Python**: PEP 8 with type hints (mypy)
- **TypeScript**: ESLint + Prettier
- **Documentation**: Comprehensive docstrings
- **Commits**: Conventional commits format

### 🔐 Security Considerations
- **JWT Authentication**: Better Auth for secure sessions (planned)
- **Input Validation**: All user inputs validated at API boundary
- **SQL Injection**: Parameterized queries with SQLAlchemy/SQLModel
- **XSS Protection**: Sanitized outputs in web app (frontend)
- **Secrets Management**: Environment variables, never hardcoded

### 🏗️ Naming Conventions
- **Python**: `snake_case` for functions, `PascalCase` for classes
- **TypeScript**: `camelCase` for variables and functions
- **Files**: Descriptive names with clear purpose
- **Branches**: `feature/phase-ii-user-auth`, `bugfix/login-issue`
- **Database**: `snake_case` for table and column names

---

## ⚡ Key Commands

### 🚀 Phase I - Console App
```bash
# Install dependencies
uv sync

# Run the application
python -m src.cli.main

# Run tests
PYTHONPATH=. python3 -m unittest discover tests/ -v
```

### 🌐 Phase II - Full-Stack Web (Current Implementation)
```bash
# Backend setup and run (in backend/ directory)
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Run backend validation
python validate_setup.py

# Test API endpoints
python test_api.py

# Database setup
neonctl projects create
neonctl branches create --project-id=xxx
```

### 🤖 Phase III - AI Integration
```bash
# Set up OpenAI API
export OPENAI_API_KEY=your_key_here

# Run AI agent
python -m ai.agents.todo_agent

# Test MCP integration
python -m ai.mcp.server --port 8000
```

### ☸️ Phase IV - Kubernetes
```bash
# Start Minikube
minikube start

# Install Helm chart
helm install todo-app ./k8s/helm/todo-app

# Port forward
kubectl port-forward svc/todo-app 8080:80
```

### ☁️ Phase V - Cloud Deployment
```bash
# Deploy to DigitalOcean
doctl kubernetes cluster kubeconfig save your-cluster
kubectl apply -f k8s/production/

# Deploy with Dapr
dapr init
dapr run --app-id todo-api -- python -m backend.main
```

### 🛠️ Spec-Driven Commands
```bash
# Generate specification
/sp.specify "Add user authentication feature"

# Generate implementation plan
/sp.plan "Implementation requirements: JWT auth, role-based access"

# Generate development tasks
/sp.tasks

# Execute implementation
/sp.implement

# Create ADR
/sp.adr "Authentication-Strategy"

# Record PHR
/sp.phr
```

---

## 💡 Important Notes

### Backend API Implementation Details
- **API Documentation**: Available at `http://localhost:8000/docs` when running
- **CORS**: Currently allows all origins (update for production)
- **Database**: Uses SQLModel with Neon PostgreSQL
- **Models**: Task model with id, title, description, completed, created_at, updated_at
- **Endpoints**:
  - `POST /api/tasks` - Create a task
  - `GET /api/tasks` - List all tasks
  - `GET /api/tasks/{id}` - Get a specific task
  - `PUT /api/tasks/{id}` - Update a task
  - `DELETE /api/tasks/{id}` - Delete a task
  - `PATCH /api/tasks/{id}/complete` - Toggle task completion

### Security Considerations
- **Environment Variables**: Store sensitive data in `.env` file
- **CORS Configuration**: Currently permissive for development, restrict in production
- **Input Validation**: All endpoints validate input using Pydantic models
- **Error Handling**: Proper HTTP status codes for different scenarios

### Development Workflow
- **Spec-Driven**: Always start with `/sp.specify` to create feature specifications
- **Implementation Tracking**: Use `/sp.plan`, `/sp.tasks`, and `/sp.implement` for structured development
- **Validation**: Run validation scripts to ensure setup is correct

### Gotchas & Critical Context
- **Database Migrations**: Need to implement Alembic for production use
- **Authentication**: Not yet implemented but planned for Phase II
- **Testing**: Unit and integration tests need to be added
- **Environment**: Ensure `.env` file is properly configured with database connection
- **Dependencies**: Use `uv` or `pip` consistently throughout the project
- **Database URLs**: Neon PostgreSQL connection strings require proper SSL configuration

### Migration Path to Next Phase
- **Frontend Integration**: Next.js app needs to be created in frontend/ directory
- **Authentication**: JWT-based auth needs to be implemented
- **Frontend API Calls**: Connect frontend to backend API endpoints
- **UI Components**: Build React components for task management

This comprehensive setup enables the evolution from a simple console app to a sophisticated, cloud-native AI-powered application while maintaining spec-driven development principles throughout the journey.

## Active Technologies
- Python 3.12 + FastAPI, SQLModel, Uvicorn, Python-dotenv, psycopg2-binary (001-backend-api)
- Neon Serverless PostgreSQL (001-backend-api)
- TypeScript 5.0+, Next.js 16 with App Router + Next.js 16, React 19, Tailwind CSS 3.4, React Hook Form, Fetch API (001-todo-ui)
- Browser localStorage for anonymous session management, backend API for task persistence (001-todo-ui)
- Python 3.12, TypeScript 5.0+ + FastAPI, SQLModel, Pydantic, Neon Serverless PostgreSQL (001-user-scoped-tasks)
- Neon Serverless PostgreSQL database with proper foreign key constraints (001-user-scoped-tasks)

## Recent Changes
- 001-backend-api: Added Python 3.12 + FastAPI, SQLModel, Uvicorn, Python-dotenv, psycopg2-binary
