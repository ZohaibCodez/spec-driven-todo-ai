---
description: "Task list for user-scoped tasks feature implementation"
---

# Tasks: User-Scoped Tasks

**Input**: Design documents from `/specs/001-user-scoped-tasks/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`
- **Current project**: `backend/` directory structure per plan.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Update requirements.txt with any new dependencies for user authentication (if needed)
- [ ] T002 Create database migration files for User model using Alembic

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 Create User model in backend/models.py with id, email, name, created_at fields
- [ ] T004 Update Task model in backend/models.py to add user_id foreign key relationship
- [ ] T005 [P] Update Pydantic schemas in backend/schemas.py to include User-related schemas
- [ ] T006 [P] Update database.py to include User model in SQLModel registry
- [ ] T007 Create database migration for User table and Task user_id column using Alembic
- [ ] T008 [P] Create UserService class in backend/services/user_service.py for user operations

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create User Account (Priority: P1) 🎯 MVP

**Goal**: Create a User model in the database with basic identification information so that tasks can be properly isolated from other users.

**Independent Test**: Can be fully tested by creating a user record in the database with email, name, and timestamp, delivering the core user identity functionality.

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T009 [P] [US1] Contract test for user creation endpoint in backend/test/test_users.py
- [ ] T010 [P] [US1] Integration test for user creation in backend/test/integration/test_user_creation.py

### Implementation for User Story 1

- [ ] T011 [P] [US1] Create UserCreate and UserRead Pydantic schemas in backend/schemas.py
- [ ] T012 [US1] Implement UserService.create_user method in backend/services/user_service.py
- [ ] T013 [US1] Create user creation endpoint POST /api/users in backend/routes/users.py
- [ ] T014 [US1] Add email uniqueness validation to User model
- [ ] T015 [US1] Add validation for required email and name fields

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Manage Personal Tasks (Priority: P1)

**Goal**: Allow users to create, view, update, and delete tasks that belong only to them, so their personal productivity can be managed separately from others.

**Independent Test**: Can be fully tested by creating tasks associated with a specific user and verifying that only that user's tasks are accessible through the API, delivering personalized task management.

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T016 [P] [US2] Contract test for GET /api/{user_id}/tasks in backend/test/test_tasks.py
- [ ] T017 [P] [US2] Contract test for POST /api/{user_id}/tasks in backend/test/test_tasks.py
- [ ] T018 [P] [US2] Contract test for PUT /api/{user_id}/tasks/{task_id} in backend/test/test_tasks.py
- [ ] T019 [P] [US2] Contract test for DELETE /api/{user_id}/tasks/{task_id} in backend/test/test_tasks.py
- [ ] T020 [P] [US2] Integration test for user-specific task operations in backend/test/integration/test_user_tasks.py

### Implementation for User Story 2

- [ ] T021 [P] [US2] Update TaskCreate and TaskUpdate schemas in backend/schemas.py to work with user_id
- [ ] T022 [US2] Modify TaskService methods to filter by user_id in backend/services/task_service.py
- [ ] T023 [US2] Update task creation to associate with user in backend/services/task_service.py
- [ ] T024 [US2] Implement user-specific task listing in backend/routes/tasks.py
- [ ] T025 [US2] Implement user-specific task creation in backend/routes/tasks.py
- [ ] T026 [US2] Implement user-specific task updating in backend/routes/tasks.py
- [ ] T027 [US2] Implement user-specific task deletion in backend/routes/tasks.py
- [ ] T028 [US2] Add validation to ensure tasks cannot be transferred between users

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Access Tasks via User-Specific Endpoints (Priority: P2)

**Goal**: Provide API endpoints that require a numeric user identifier in the URL path, so that proper scoping and future authentication can be implemented.

**Independent Test**: Can be fully tested by making API calls to user-specific endpoints and verifying that the numeric user ID in the path determines which tasks are accessed, delivering structured API access patterns.

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T029 [P] [US3] Contract test for PATCH /api/{user_id}/tasks/{task_id}/complete in backend/test/test_tasks.py
- [ ] T030 [P] [US3] Integration test for user-specific endpoint access in backend/test/integration/test_user_endpoints.py

### Implementation for User Story 3

- [ ] T031 [P] [US3] Update all task endpoints to require user_id in path in backend/routes/tasks.py
- [ ] T032 [US3] Implement GET /api/{user_id}/tasks endpoint with user filtering
- [ ] T033 [US3] Implement GET /api/{user_id}/tasks/{task_id} endpoint with user validation
- [ ] T034 [US3] Implement PATCH /api/{user_id}/tasks/{task_id}/complete endpoint
- [ ] T035 [US3] Add validation to return 404 when user_id does not exist
- [ ] T036 [US3] Add validation to ensure users can't access tasks from other users
- [ ] T037 [US3] Add cascade delete for tasks when user is deleted

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T038 [P] Update API documentation to reflect user-scoped endpoints
- [ ] T039 Add proper error handling for user access violations
- [ ] T040 [P] Update README.md with user-scoped task usage examples
- [ ] T041 Run quickstart.md validation to ensure all functionality works
- [ ] T042 Add database constraints to enforce email uniqueness at DB level
- [ ] T043 Add validation to prevent task transfer between users
- [ ] T044 Update database session handling to support new User model operations

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for user creation endpoint in backend/test/test_users.py"
Task: "Integration test for user creation in backend/test/integration/test_user_creation.py"

# Launch all models for User Story 1 together:
Task: "Create UserCreate and UserRead Pydantic schemas in backend/schemas.py"
Task: "Implement UserService.create_user method in backend/services/user_service.py"
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
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence