# Tasks: CLI Todo Application

**Feature**: CLI Todo Application
**Branch**: `001-cli-todo-app`
**Generated**: 2025-12-13
**Based on**: spec.md, plan.md, data-model.md, research.md

## Implementation Strategy

MVP approach: Implement User Story 1 (Add New Tasks) first, then incrementally add other user stories. Each user story is designed to be independently testable and deliverable.

## Dependencies

- User Story 1 (Add Tasks) must be completed before User Story 2 (View Tasks)
- User Story 2 (View Tasks) provides foundational functionality for User Stories 3-5
- User Story 6 (Menu Interface) integrates all functionality together

## Parallel Execution Examples

- Task models and storage layer can be developed in parallel with CLI interface (different layers)
- Unit tests can be written in parallel with implementation
- Different user stories can be developed by different developers after foundational components are complete

---

## Phase 1: Setup Tasks

### Goal
Initialize project structure and basic configuration

- [ ] T001 Create project directory structure: src/models/, src/storage/, src/cli/, tests/unit/, tests/integration/
- [ ] T002 Create pyproject.toml with Python 3.13+ requirement and basic metadata
- [ ] T003 Set up basic configuration files (.gitignore, .flake8, .prettierrc)

---

## Phase 2: Foundational Tasks

### Goal
Create foundational components that all user stories depend on

- [ ] T004 [P] Create Task dataclass in src/models/task.py with id, title, description, completed fields and validation
- [ ] T005 [P] Create TaskStorage class in src/storage/task_storage.py with dictionary-based in-memory storage
- [ ] T006 [P] Implement basic validation functions for task title (1-100 chars) and description (0-500 chars)
- [ ] T007 [P] Create basic CLI menu structure in src/cli/main.py with placeholder functions
- [ ] T008 [P] Create base test files for unit testing in tests/unit/

---

## Phase 3: User Story 1 - Add New Tasks (Priority: P1)

### Goal
Enable users to add new tasks with required title and optional description

**Independent Test Criteria**: Can add tasks with different titles and descriptions and verify they appear in the task list with correct IDs

- [ ] T009 [P] [US1] Implement TaskStorage.add_task() method to add tasks with sequential IDs starting from 1
- [ ] T010 [P] [US1] Create CLI function to handle add task input in src/cli/main.py
- [ ] T011 [US1] Add input validation for task title (1-100 characters) in src/cli/main.py
- [ ] T012 [US1] Add input validation for task description (0-500 characters) in src/cli/main.py
- [ ] T013 [US1] Create unit tests for TaskStorage.add_task() in tests/unit/test_storage/
- [ ] T014 [US1] Create unit tests for add task CLI function in tests/unit/test_cli/
- [ ] T015 [US1] Verify task is marked as incomplete by default

---

## Phase 4: User Story 2 - View All Tasks (Priority: P1)

### Goal
Enable users to see all their tasks with ID, title, completion status, and description

**Independent Test Criteria**: Can add tasks and verify they display correctly with proper formatting and status indicators

- [ ] T016 [P] [US2] Implement TaskStorage.list_tasks() method to return all tasks
- [ ] T017 [P] [US2] Implement TaskStorage.get_task() method to retrieve a specific task by ID
- [ ] T018 [US2] Create CLI function to display tasks with [✓] for completed and [ ] for incomplete in src/cli/main.py
- [ ] T019 [US2] Format task display as "ID: [✓/ ] Title - Description" in src/cli/main.py
- [ ] T020 [US2] Create unit tests for TaskStorage.list_tasks() and get_task() in tests/unit/test_storage/
- [ ] T021 [US2] Create unit tests for view tasks CLI function in tests/unit/test_cli/
- [ ] T022 [US2] Verify proper formatting for both completed and incomplete tasks

---

## Phase 5: User Story 6 - Menu-Driven Interface and Exit (Priority: P1)

### Goal
Provide menu system with options 1-6 and clean exit functionality

**Independent Test Criteria**: Can navigate through all menu options and verify the correct functionality is executed

- [ ] T023 [P] [US6] Implement main menu loop in src/cli/main.py with options 1-6
- [ ] T024 [US6] Add option 1: Add Task to main menu
- [ ] T025 [US6] Add option 2: View Tasks to main menu
- [ ] T026 [US6] Add option 6: Exit to main menu
- [ ] T027 [US6] Implement clean exit functionality in src/cli/main.py
- [ ] T028 [US6] Add menu display function in src/cli/main.py
- [ ] T029 [US6] Create unit tests for menu functionality in tests/unit/test_cli/
- [ ] T030 [US6] Verify menu displays options 1-6 with clear labels

---

## Phase 6: User Story 3 - Toggle Task Completion Status (Priority: P2)

### Goal
Allow users to mark tasks as complete or incomplete

**Independent Test Criteria**: Can toggle task status and verify the status changes correctly in the display

- [ ] T031 [P] [US3] Implement TaskStorage.toggle_task_status() method to flip completion status
- [ ] T032 [US3] Create CLI function to handle toggle task input in src/cli/main.py
- [ ] T033 [US3] Add validation to ensure task ID exists before toggling in src/cli/main.py
- [ ] T034 [US3] Add option 5: Toggle Task Status to main menu
- [ ] T035 [US3] Create unit tests for TaskStorage.toggle_task_status() in tests/unit/test_storage/
- [ ] T036 [US3] Create unit tests for toggle task CLI function in tests/unit/test_cli/
- [ ] T037 [US3] Verify status correctly toggles between complete/incomplete

---

## Phase 7: User Story 4 - Update Task Title or Description (Priority: P2)

### Goal
Allow users to modify the title or description of an existing task

**Independent Test Criteria**: Can update task details and verify the changes persist in the system

- [ ] T038 [P] [US4] Implement TaskStorage.update_task() method to modify task title or description
- [ ] T039 [US4] Create CLI function to handle update task input in src/cli/main.py
- [ ] T040 [US4] Add validation for updated title and description in src/cli/main.py
- [ ] T041 [US4] Add option 3: Update Task to main menu
- [ ] T042 [US4] Create unit tests for TaskStorage.update_task() in tests/unit/test_storage/
- [ ] T043 [US4] Create unit tests for update task CLI function in tests/unit/test_cli/
- [ ] T044 [US4] Verify partial updates (title only or description only) work correctly

---

## Phase 8: User Story 5 - Delete Tasks with Confirmation (Priority: P3)

### Goal
Allow users to remove tasks from their todo list with confirmation

**Independent Test Criteria**: Can delete tasks and verify they no longer appear in the task list

- [ ] T045 [P] [US5] Implement TaskStorage.delete_task() method to remove tasks by ID
- [ ] T046 [US5] Create CLI function to handle delete task input with confirmation in src/cli/main.py
- [ ] T047 [US5] Add "yes/no" confirmation prompt before deletion in src/cli/main.py
- [ ] T048 [US5] Add option 4: Delete Task to main menu
- [ ] T049 [US5] Create unit tests for TaskStorage.delete_task() in tests/unit/test_storage/
- [ ] T050 [US5] Create unit tests for delete task CLI function in tests/unit/test_cli/
- [ ] T051 [US5] Verify task is removed from storage after confirmed deletion

---

## Phase 9: Error Handling and Validation

### Goal
Implement comprehensive error handling for all edge cases

- [ ] T052 [P] Add validation for invalid task IDs (non-numeric, out of range) across all operations
- [ ] T053 [P] Add validation for empty or whitespace-only titles
- [ ] T054 [P] Add validation for invalid menu selections outside the 1-6 range
- [ ] T055 [P] Implement clear error messages that state what went wrong and suggest how to fix it
- [ ] T056 [P] Add error handling for non-existent task IDs with clear error messages
- [ ] T057 [P] Create unit tests for all error handling scenarios
- [ ] T058 [P] Verify error messages are user-friendly and actionable

---

## Phase 10: Polish & Cross-Cutting Concerns

### Goal
Final touches and integration testing

- [ ] T059 [P] Add docstrings to all functions following constitution requirements
- [ ] T060 [P] Ensure no function exceeds 20 lines of code as per constitution
- [ ] T061 [P] Run full test suite and verify 80%+ code coverage
- [ ] T062 [P] Run linting checks (flake8) and fix any issues
- [ ] T063 [P] Run type checking (mypy) and fix any issues
- [ ] T064 [P] Create integration tests for complete user workflows in tests/integration/
- [ ] T065 [P] Add README with usage instructions
- [ ] T066 [P] Verify all constitution compliance requirements are met