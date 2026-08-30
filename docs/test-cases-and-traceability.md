# Initial Test Cases and Requirements Traceability

## Purpose
This document defines the intial test cases for the Checkpoint prototype and provides traceability between functional/non-functional requirements and the planned tests.

The initial test cases focus on the highest-risk and most important functional workflows of the prototype. They are intended to provide initial coverage as opposed to exhaustive testing of every input or system condition.

## Test Cases

### TC-01: Create a valid project (FR-01)

**Test objective:** Verify that a developer can successfully create a new project with valid data.

**Preconditions:** Backend running; database reachable.

**Steps:**
1. POST /api/projects with valid Name and Description.
2. GET /api/projects/{id} to confirm.

**Test data:** `{ "name": "Project Aurora", "description": "Test project for Aurora build" }`

**Expected result:** 201 Created; response includes generated Id, matching Name/Description, SessionCount = 0; GET returns same data.

**Actual result:** 201 Created; project appeared in list with correct name and description.

**Status:** Passed

---

### TC-02: Reject invalid project — blank name (FR-01, NFR-07)

**Test objective:** Verify that the API rejects a project submission with a blank required field, rather than silently accepting invalid data.

**Preconditions:** Backend running.

**Steps:**
1. POST /api/projects with Name = "" (blank).
2. Observe response.

**Test data:** `{ "name": "", "description": "Test" }`

**Expected result:** 400 Bad Request with field-specific validation error for Name; no project created.

**Actual result:** Not yet executed

**Status:** Not yet executed

---

### TC-03: Create a playtest session under a project (FR-03)

**Test objective:** Verify that a playtest session can be created and correctly associated with its parent project.

**Preconditions:** A project exists (e.g. from TC-01).

**Steps:**
1. POST /api/projects/{projectId}/sessions with Name, SessionDate, GameVersion.
2. GET the session to confirm.

**Test data:** `{ "name": "Alpha Test 1", "sessionDate": "2026-09-15", "gameVersion": "v0.9.1-alpha", "notes": "" }`

**Expected result:** 201 Created; session returned with correct ProjectId, Status = "Planned".

**Actual result:** Not yet executed

**Status:** Not yet executed

---

### TC-04: Submit general (non-defect) feedback (FR-05, FR-07)

**Test objective:** Verify that non-defect feedback can be submitted and categorised without requiring defect-specific fields.

**Preconditions:** A session exists.

**Steps:**
1. POST feedback with Category = "Usability".
2. GET feedback for session to confirm.

**Test data:** `{ "title": "Menu confusing", "description": "Main menu items are not intuitive", "category": "Usability", "priority": "Medium" }`

**Expected result:** 201 Created; feedback is listed under the session; defect-specific fields are not required for a non-Defect submission.

**Actual result:** Not yet executed

**Status:** Not yet executed

---

### TC-05: Submit valid defect feedback (FR-06)

**Test objective:** Verify that a complete defect report, including all required reproduction fields, is accepted and stored correctly.

**Preconditions:** A session exists.

**Steps:**
1. POST feedback with Category = "Defect" and all four defect fields populated.

**Test data:** `{ "title": "Crash on load", "description": "Game crashes when loading level", "category": "Defect", "expectedBehaviour": "Level loads normally", "actualBehaviour": "App exits with error 0xDEAD", "reproductionSteps": "1. Launch; 2. Load level X; 3. Observe crash", "environment": "Windows 11, RTX 3060" }`

**Expected result:** 201 Created; all defect fields stored and retrievable.

**Actual result:** 201 Created; defect feedback stored with all four fields correctly displayed.

**Status:** Passed

---

### TC-06: Reject incomplete defect feedback (FR-06)

**Test objective:** Verify that the API enforces FR-06's conditional requirement, rejecting a defect report that omits required reproduction information.

**Preconditions:** A session exists.

**Steps:**
1. POST feedback with Category = "Defect" but omit ExpectedBehaviour, ActualBehaviour, ReproductionSteps, Environment.

**Test data:** `{ "title": "Crash on load", "description": "Game crashes", "category": "Defect" }`

**Expected result:** 400 Bad Request with field-specific validation errors naming each missing defect field; no feedback created.

**Actual result:** 400 response; field-specific validation errors shown for all four defect fields; no feedback item created.

**Status:** Pass

---

### TC-07: Triage feedback — update priority and status (FR-08, FR-09)

**Test objective:** Verify that a developer can update a feedback item's priority and status independently of its original submission content.

**Preconditions:** A feedback item exists (e.g. from TC-04).

**Steps:**
1. PUT feedback with Priority = "High".
2. PUT again with Status = "InProgress".
3. GET feedback after each to confirm.

**Test data:** `{ "category": "Usability", "priority": "High", "status": "InProgress" }`

**Expected result:** Each PUT returns 200 OK; GET reflects the updated priority and status.

**Actual result:** Not yet executed

**Status:** Not yet executed

---

### TC-08: Delete project with confirmation and cascade (FR-13)

**Test objective:** Verify that deleting a project requires confirmation and correctly removes the project and its associated sessions and feedback.

**Preconditions:** A project exists with at least one session and one feedback item.

**Steps:**
1. Navigate to the Projects page.
2. Select Delete for the test project.
3. Confirm that the deletion confirmation dialog appears.
4. Confirm the deletion.
5. Verify that the project no longer appears.
6. Attempt to navigate back to the deleted project's URL directly, and confirm its session and feedback no longer appear anywhere in the UI.

**Test data:** Existing project containing at least one session and feedback item.

**Expected result:** The confirmation dialog is displayed before deletion; after confirmation, the project is deleted and its associated sessions and feedback are also removed.

**Actual result:** Confirmation dialog displayed before deletion; after confirming, project removed from list; DELETE returned 204.

**Status:** Pass

---

## Requirements Traceability Matrix

| Requirement | Description | Test Case(s) |
|---|---|---|
| FR-01 | Create project | TC-01, TC-02 |
| FR-02 | View/update project | *(exercised informally during system testing)* |
| FR-03 | Create playtest session | TC-03 |
| FR-04 | View/update session | *(exercised informally during system testing)* |
| FR-05 | Submit feedback | TC-04 |
| FR-06 | Defect fields required | TC-05, TC-06 |
| FR-07 | Categorise feedback | TC-04 |
| FR-08 | Assign priority | TC-07 |
| FR-09 | Update status | TC-07 |
| FR-10 | View feedback | *(exercised informally during system testing)* |
| FR-11 | Filter feedback | *(exercised informally during system testing)* |
| FR-12 | Dashboard overview | *(exercised informally during system testing)* |
| FR-13 | Delete with cascade | TC-08 |
| NFR-07 | Input validation/sanitisation | TC-02, TC-06 |

Traceability supports quality assurance and change management by providing a clear mapping of requirements to test cases. This provides developers with an overview of requirement coverage, enabling the identification of coverage gaps and the introduction of new test cases.
Change management is also supported by the traceability matrix, as it allows developers to track which test cases will need to be updated if a requirement change is undertaken.

For example, within Checkpoints traceability matrix, FR-02 and FR-10-12 are flagged as informally tested and identified as candidates for formal test cases in the next test phase.
Similarly, when GameVersion was removed from Project during development, the traceability matrix could have helped identify exactly which test cases needed review, rather than requiring a full re-test of the entire system.