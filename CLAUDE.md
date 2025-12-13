# 🚀 Hackathon II Todo Application - CLAUDE.md

## 📋 Overview

Welcome to the **Hackathon II Todo Application** - a progressive, spec-driven project that evolves through 5 phases from a simple Python console app to a full cloud-native deployment with AI capabilities.

### 🎯 Project Vision
A comprehensive todo application that demonstrates modern development practices, from basic CLI functionality to AI-powered workflows and cloud-native deployment patterns.

### 📊 Phase Evolution
- **Phase I** 📟: Python console app (in-memory storage)
- **Phase II** 🌐: Full-stack web app (Next.js + FastAPI + Neon DB)
- **Phase III** 🤖: AI chatbot (OpenAI Agents + MCP)
- **Phase IV** ☸️: Local Kubernetes (Minikube + Helm)
- **Phase V** ☁️: Cloud deployment (DigitalOcean/GKE + Kafka + Dapr)

### 🎯 Spec-Driven Development Approach
This project uses **spec-driven development** methodology with:
- 📄 **AGENTS.md** for agent specifications
- 🛠️ **Spec-KitPlus** for structured development
- 🤖 **Claude Code** for AI-assisted implementation

---

## 🛠️ Tech Stack

### Phase I - Console App
- **Language**: Python 3.12+
- **Architecture**: Three-layer (Models, Storage, CLI)
- **Storage**: In-memory dictionary
- **Dependencies**: Standard library only

### Phase II - Full-Stack Web
- **Frontend**: Next.js 14+ (App Router)
- **Backend**: FastAPI 0.104+
- **Database**: Neon PostgreSQL
- **Auth**: Better Auth (JWT)
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

## 📁 Project Structure

```
hackathon-todo/
├── 📁 specs/                    # Spec-driven development artifacts
│   ├── 📁 phase-i-console/     # Phase I specifications
│   │   ├── spec.md            # Feature specification
│   │   ├── plan.md            # Implementation plan
│   │   ├── tasks.md           # Development tasks
│   │   └── contracts/         # API contracts
│   ├── 📁 phase-ii-web/       # Phase II specifications
│   │   ├── spec.md
│   │   ├── plan.md
│   │   └── tasks.md
│   ├── 📁 phase-iii-ai/       # Phase III specifications
│   │   ├── spec.md
│   │   ├── plan.md
│   │   └── tasks.md
│   ├── 📁 phase-iv-k8s/       # Phase IV specifications
│   │   ├── spec.md
│   │   ├── plan.md
│   │   └── tasks.md
│   └── 📁 phase-v-cloud/      # Phase V specifications
│       ├── spec.md
│       ├── plan.md
│       └── tasks.md
├── 📁 frontend/                # Next.js application (Phase II+)
│   ├── src/
│   ├── pages/
│   ├── components/
│   └── package.json
├── 📁 backend/                 # FastAPI application (Phase II+)
│   ├── src/
│   ├── api/
│   ├── models/
│   ├── services/
│   └── requirements.txt
├── 📁 ai/                      # AI agents and MCP (Phase III+)
│   ├── agents/
│   ├── mcp/
│   └── config/
├── 📁 k8s/                    # Kubernetes manifests (Phase IV+)
│   ├── helm/
│   ├── manifests/
│   └── kustomize/
├── 📁 .specify/               # Spec-KitPlus configuration
│   ├── memory/
│   ├── scripts/
│   └── templates/
├── 📁 history/                # Prompt history records
│   └── prompts/
├── 📄 CLAUDE.md              # This file
├── 📄 AGENTS.md              # Agent specifications
├── 📄 pyproject.toml         # Python configuration
├── 📄 package.json           # Frontend dependencies
├── 📄 docker-compose.yml     # Local development
└── 📄 README.md              # Project documentation
```

---

## 📐 Development Conventions

### 🏗️ Architecture Principles
1. **Separation of Concerns**: Clear boundaries between layers
2. **Spec-First**: All features start with specifications
3. **Test-Driven**: Write tests before implementation
4. **Security-First**: Authentication and validation at every layer

### 📝 Code Standards
- **Python**: PEP 8 with type hints (mypy)
- **JavaScript**: ESLint + Prettier
- **Documentation**: Comprehensive docstrings
- **Commits**: Conventional commits format

### 🔐 Security Considerations
- **JWT Authentication**: Better Auth for secure sessions
- **Input Validation**: All user inputs validated at API boundary
- **SQL Injection**: Parameterized queries with SQLAlchemy
- **XSS Protection**: Sanitized outputs in web app
- **Secrets Management**: Environment variables, never hardcoded

### 🏗️ Naming Conventions
- **Python**: `snake_case` for functions, `PascalCase` for classes
- **JavaScript**: `camelCase` for variables and functions
- **Files**: Descriptive names with clear purpose
- **Branches**: `feature/phase-ii-user-auth`, `bugfix/login-issue`

---

## ⚡ Development Commands

### 🚀 Phase I - Console App
```bash
# Install dependencies
uv sync

# Run the application
python -m src.cli.main

# Run tests
PYTHONPATH=. python3 -m unittest discover tests/ -v

# Run performance tests
PYTHONPATH=. python3 -c "
import time
from src.storage.task_storage import TaskStorage
storage = TaskStorage()
start_time = time.time()
for i in range(1000): storage.add_task(f'Task {i}')
print(f'1000 tasks in {time.time() - start_time:.4f}s')
"
```

### 🌐 Phase II - Full-Stack Web
```bash
# Backend (in backend/ directory)
pip install -r requirements.txt
uvicorn src.main:app --reload

# Frontend (in frontend/ directory)
npm install
npm run dev

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

## 💡 Debugging Tips

### 🔧 Phase I - Console App
- **Performance**: Use the built-in performance test to verify O(1) operations
- **Memory**: Monitor memory usage with 1000+ tasks
- **Validation**: Test edge cases with invalid inputs

### 🌐 Phase II - Full-Stack Web
- **Database**: Use Neon console to monitor queries and connections
- **Authentication**: Check JWT token validity with jwt.io
- **CORS**: Verify frontend/backend URL matching
- **Environment**: Use `.env` files for local development

### 🤖 Phase III - AI Integration
- **API Limits**: Monitor OpenAI rate limits and costs
- **Context Window**: Keep conversation history optimized
- **MCP Debugging**: Enable verbose logging for MCP server
- **Agent State**: Track conversation state across turns

### ☸️ Phase IV - Kubernetes
- **Logs**: `kubectl logs -f deployment/todo-app`
- **Port Forwarding**: `kubectl port-forward` for local testing
- **Helm**: `helm list` and `helm status` for deployment status
- **Dapr**: `dapr list` to see running services

### ☁️ Phase V - Cloud Production
- **Monitoring**: Set up Prometheus metrics and Grafana dashboards
- **Logging**: Use structured logging with correlation IDs
- **Tracing**: Implement distributed tracing with Jaeger
- **Alerting**: Set up alerts for service degradation

### 🐛 Common Debugging Commands
```bash
# Check environment variables
printenv | grep TODO

# Python debugging
python -m pdb script.py

# Frontend debugging
npm run build && npm run start

# Database debugging
psql "connection_string" -c "SELECT * FROM tasks;"

# Kubernetes debugging
kubectl describe pod <pod-name>
kubectl exec -it <pod-name> -- /bin/bash
```

---

## 📚 Notes & Resources

### 📖 Key Documentation Links
- **Neon DB**: [https://neon.tech/docs](https://neon.tech/docs)
- **Vercel**: [https://vercel.com/docs](https://vercel.com/docs)
- **DigitalOcean**: [https://docs.digitalocean.com](https://docs.digitalocean.com)
- **Kubernetes**: [https://kubernetes.io/docs](https://kubernetes.io/docs)
- **Dapr**: [https://docs.dapr.io](https://docs.dapr.io)
- **FastAPI**: [https://fastapi.tiangolo.com](https://fastapi.tiangolo.com)
- **Better Auth**: [https://better-auth.com](https://better-auth.com)

### 🎯 Spec-Driven Workflow Integration
1. **Specification Phase**: Write `spec.md` with user stories and requirements
2. **Planning Phase**: Generate `plan.md` with technical approach
3. **Task Generation**: Create `tasks.md` with implementation steps
4. **Implementation**: Execute tasks with `/sp.implement`
5. **Verification**: Test against original specifications
6. **Documentation**: Update all artifacts for next phase

### 🔄 Phase Transition Checklist
- [ ] All specs completed and validated
- [ ] Tests passing at current phase
- [ ] Performance requirements met
- [ ] Security audit completed
- [ ] Documentation updated
- [ ] Migration plan for next phase ready

### 🚨 Important Considerations
- **Data Migration**: Plan for data persistence between phases
- **Backward Compatibility**: Maintain API compatibility when possible
- **Cost Management**: Monitor cloud costs in Phase V
- **Scalability**: Design for horizontal scaling from Phase II
- **Observability**: Implement logging, metrics, and tracing early

### 🤝 Collaboration Guidelines
- **Pull Requests**: Always link to related specification
- **Code Reviews**: Focus on spec compliance and architecture
- **Branch Strategy**: Feature branches from main for each phase
- **Versioning**: Use semantic versioning across all phases

This comprehensive setup enables the evolution from a simple console app to a sophisticated, cloud-native AI-powered application while maintaining spec-driven development principles throughout the journey.