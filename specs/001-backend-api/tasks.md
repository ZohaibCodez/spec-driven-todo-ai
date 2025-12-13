---
description: "Task list for Backend API Foundation - Basic CRUD implementation"
---

# Tasks: Backend API Foundation - Basic CRUD

**Input**: Design documents from `/specs/001-backend-api/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The feature specification does not explicitly request tests, so test tasks are not included in this implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend API**: `backend/` at repository root
- Paths shown below follow the plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create backend directory structure
- [X] T002 Create requirements.txt with FastAPI, SQLModel, Uvicorn, Python-dotenv, psycopg2-binary
- [X] T003 [P] Create .env file template with DATABASE_URL placeholder
- [X] T004 Create README.md for backend API

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Create database.py with Neon PostgreSQL connection setup using SQLModel
- [X] T006 Create models.py with Task SQLModel entity based on data-model.md
- [X] T007 Create schemas.py with Pydantic models (TaskCreate, TaskUpdate, TaskResponse) based on data-model.md
- [X] T008 Create main.py with FastAPI app initialization and CORS middleware
- [X] T009 Configure environment variables loading with python-dotenv

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create and Retrieve Tasks (Priority: P1) 🎯 MVP

**Goal**: Enable creating new tasks and retrieving them by ID, forming the foundational CRUD functionality.

**Independent Test**: Can be fully tested by creating a task via POST and then retrieving it via GET to verify it was stored and can be retrieved.

### Implementation for User Story 1

- [X] T010 Create routes/tasks.py with POST /api/tasks endpoint for creating tasks
- [X] T011 [P] [US1] Implement GET /api/tasks/{id} endpoint for retrieving single task
- [X] T012 [US1] Add POST /api/tasks route to main.py application
- [X] T013 [US1] Add GET /api/tasks/{id} route to main.py application
- [X] T014 [US1] Test creation and retrieval of a task to verify functionality

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Update and Delete Tasks (Priority: P2)

**Goal**: Enable updating and deleting existing tasks to complete the core CRUD operations.

**Independent Test**: Can be fully tested by creating a task, updating its properties via PUT, and then deleting it via DELETE to verify the full lifecycle.

### Implementation for User Story 2

- [X] T015 [US2] Create PUT /api/tasks/{id} endpoint for updating tasks in routes/tasks.py
- [X] T016 [US2] Create DELETE /api/tasks/{id} endpoint for deleting tasks in routes/tasks.py
- [X] T017 [US2] Add PUT /api/tasks/{id} route to main.py application
- [X] T018 [US2] Add DELETE /api/tasks/{id} route to main.py application
- [X] T019 [US2] Test update and delete functionality to verify full task lifecycle

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - List All Tasks (Priority: P3)

**Goal**: Enable retrieving all tasks at once for bulk access to task data.

**Independent Test**: Can be fully tested by creating multiple tasks and then retrieving all of them in a single response.

### Implementation for User Story 3

- [X] T020 [US3] Create GET /api/tasks endpoint for listing all tasks in routes/tasks.py
- [X] T021 [US3] Add GET /api/tasks route to main.py application
- [X] T022 [US3] Test listing all tasks functionality with multiple created tasks

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: User Story 4 - Toggle Task Completion (Priority: P4)

**Goal**: Enable toggling the completion status of tasks for common task management operations.

**Independent Test**: Can be fully tested by creating a task, toggling its completion status via PATCH, and verifying the status changed.

### Implementation for User Story 4

- [X] T023 [US4] Create PATCH /api/tasks/{id}/complete endpoint for toggling completion status in routes/tasks.py
- [X] T024 [US4] Add PATCH /api/tasks/{id}/complete route to main.py application
- [X] T025 [US4] Test toggle completion functionality to verify status changes

**Checkpoint**: All user stories should now be functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T026 [P] Add proper error handling with appropriate HTTP status codes throughout all endpoints
- [X] T027 [P] Add input validation for all endpoints based on data-model.md validation rules
- [X] T028 [P] Add timestamp auto-generation for created_at and updated_at fields
- [X] T029 Add comprehensive documentation to README.md
- [X] T030 Test all endpoints manually to ensure proper JSON responses and status codes
- [X] T031 Run quickstart validation to ensure setup instructions work correctly

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - May integrate with previous stories but should be independently testable

### Within Each User Story

- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all components for User Story 1 together:
Task: "Create POST /api/tasks endpoint for creating tasks in routes/tasks.py"
Task: "Implement GET /api/tasks/{id} endpoint for retrieving single task in routes/tasks.py"
Task: "Add POST /api/tasks route to main.py application"
Task: "Add GET /api/tasks/{id} route to main.py application"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
   - Developer D: User Story 4
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence