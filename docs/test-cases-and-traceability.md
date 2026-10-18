# Initial Test Cases and Requirements Traceability

## Purpose
This document defines the eighteen test cases used to verify Checkpoint, records their execution results against the final build, and traces every requirement to its implementation, tests, results and defects.

TC-01 to TC-08 were initial test cases developed to provide coverage of the highest-risk and most important functional workflows of the prototype. TC-09 to TC-18 are added to provide broader postive, negative, boundary, invalid-input and error-handling coverage.

## Test Environment and Build Under Test
| Item | Value |
| --- | --- |
| Build (git commit) | 2cbc8ff |
| Browser | Google Chrome 137.0.7151.104 (Official Build) (64-bit) |
| Operating System | Windows 11 25H2 |
| .NET SDK | 10.0.401 |
| Node.js | 24.15.0 |
| Database | SQLite, created fresh before the run |
| Evidence Folder | `docs/evidence/` |

## Test Data (Dataset D1)
The test data used in the test cases involves one project, one session and five feedback items, built up incrementally through the test cases.

| Item | Title | Category | Priority | Status | Created In |
|---|---|---|---|---|---|
| F1 | Menu confusing | Usability | High | In Progress | TC-04, then changed in TC-07 |
| F2 | Crash on load | Defect | Medium | New | TC-05 |
| F3 | Boss damage too high | Balance | Critical | New | Preparation step before TC-10 |
| F4 | Camera feels floaty | Gameplay | Low | Resolved | Preparation step before TC-10 |
| F5 | Audio cuts out | Defect | High | New | Preparation step before TC-10 |

## Test Cases

### TC-01: Create a valid project
- **Requirement(s):** FR-01 (AC-01)
- **Test type:** Functional, Positive
- **Objective:** Verify that a developer can create a project with valid data.
- **Preconditions:** Backend and frontend running, empty database.
- **Steps:** (1) Open Projects. (2) Click New Project. (3) Enter the test data and click Create Project. (4) In DevTools Network, find the POST/api/projects request.
- **Test data:** Name: Project Aurora. Description: Test project for Aurora build.
- **Expected result:** The dialog closes, Project Aurora appears in the list showing zero sessions, and the POST returns 201.
- **Evidence:** `docs/evidence/TC-01/`
- **Actual result:** Not run
- **Status:** Not run

---
### TC-02: Reject a blank project name
- **Requirement(s):** FR-01, NFR-07 (AC-18)
- **Test type:** Functional, Negative
- **Objective:** Verify that a project with a blank required field is rejected, not silently accepted.
- **Preconditions:** Project Aurora exists.
- **Steps:** (1) Click New Project. (2) Leave Name blank and enter a description. (3) Click Create Project. (4) Check the POST request in DevTools Network.
- **Test data:** Name: (blank). Description: Test project with blank name.
- **Expected result:** The dialog stays open, an error appears under Name, the POST returns 400, and no new project appears in the list.
- **Evidence:** `docs/evidence/TC-02/`
- **Actual result:** Not run
- **Status:** Not run

---

### TC-03: Create a playtest session
- **Requirement(s):** FR-03 (AC-03)
- **Test type:** Functional, Positive
- **Objective:** Verify that a session can be created and is associated with its project.
- **Preconditions:** Project Aurora exists.
- **Steps:** (1) Open Project Aurora. (2) Click New Session. (3) Enter the test data and click Create Session. (4) Check the POST request in DevTools Network.
- **Test data:** Name: Alpha Test 1. Date: 15 September 2026. Game Version: v0.9.1-alpha. Notes: (blank).
- **Expected result:** The POST returns 201, and the sessions table shows Alpha Test 1 with status Planned and 0 feedback.
- **Evidence:** `docs/evidence/TC-03/`
- **Actual result:** Not run
- **Status:** Not run

---

### TC-04: Submit general feedback
- **Requirement(s):** FR-05, FR-07, FR-10 (AC-05)
- **Test type:** Functional, Positive
- **Objective:** Verify that non-defect feedback can be submitted and categorised without defect-only fields.
- **Preconditions:** Session Alpha Test 1 exists.
- **Steps:** (1) Open the session. (2) Click Submit Feedback. (3) Enter the test data and submit. (4) Check the POST request in DevTools Network.
- **Test data:** Title: Menu confusing. Description: Main menu items are not intuitive. Category: Usabibility. Priority: Medium.
- **Expected result:** The POST returns 201, the item appears in the list with a Usability badge, and the four defect fields were neither shown nor required.
- **Evidence:** `docs/evidence/TC-04/`
- **Actual result:** Not run
- **Status:** Not run

---

### TC-05: Submit and view a valid defect
- **Requirement(s):** FR-06, FR-10 (AC-06, AC-08)
- **Test type:** Functional, Positive
- **Objective:** Verify that a complete defect report is accepted, stored and displayed with all four reproduction fields.
- **Preconditions:** Session Alpha Test 1 exists.
- **Steps:** (1) Click Submit Feedback. (2) Choose Category Defect; four extra fields appear. (3) Enter the test data and submit. (4) Click the new item to expand it.
- **Test data:** Title: Crash on load. Description: Game crashes when loading level. Category: Defect. Expected behaviour: Level loads normally. Actual behaviour: App exits with error 0xDEAD. Reproduction steps: 1. Launch; 2. Load level X; 3. Observe crash. Environment: Windows 11, RTX 3060
- **Expected result:** The POST returns 201, the item shows a Defect badge, and the expanded item displays all four defect fields as entered.
- **Evidence:** `docs/evidence/TC-05/`
- **Actual result:** Not run
- **Status:** Not run

---

### TC-06: Reject an incomplete defect
- **Requirement(s):** FR-06 (AC-06).
- **Test type:** Functional, Negative
- **Objective:** Verify that a defect report missing its reproduction information is rejected.
- **Preconditions:** Session Alpha Test 1 exists.
- **Steps:** (1) Click Submit feedback. (2) Enter the test data and choose Category Defect. (3) Leave the four defect fields blank and submit. (4) Check the request in DevTools Network
- **Test data:** Title: Crash on load. Description: Game crashes. Category: Defect.
- **Expected result:** The dialog stays open, a message says four defect details are still needed, an error appears under each of the four fields, the POST returns 400, and the feedback count does not change.
- **Evidence:** `docs/evidence/TC-06/`
- **Actual result:** Not run.
- **Status:** Not run

---

### TC-07: Triage priority and status
- **Requirement(s):** FR-08, FR-09 (AC-07)
- **Test type:** Functional, Positive
- **Objective:** Verify that a developer can change an item's priority and status, and that the change persists.
- **Preconditions:** Feedback item Menu confusing exists in session Alpha Test 1.
- **Steps:** (1) Click Menu confusing to expand it. (2) Set Priority to High. (3) Set Status to In Progress. (4) Refresh the page and expand the item again. (5) Check both PUT requests in DevTools Network.
- **Test data:** Priority: High. Status: In Progress.
- **Expected result:** Each change returns 200 from the PUT, and after the refresh the item still shows High and In Progress.
- **Evidence:** `docs/evidence/TC-07/`
- **Actual result:** Not run
- **Status:** Not run

---

### TC-08: Delete a project with confirmation and cascade
- **Requirement(s):** FR-13 (AC-11, AC-12, AC-13)
- **Test type:** Functional, Alternative Flow
- **Objective:** Verify that deletion needs confirmation, can be cancelled, and removes the project with its sessions and feedback.
- **Preconditions:** Create a throwaway project called Disposable with one session and one feedback item (any data). Copy the project URL and the session URL before deleting.
- **Steps:** (1) Open Projects. (2) Click Delete on Disposable. (3) In the dialog click Cancel. (4) Check the project is still listed. (5) Click Delete again and confirm. (6) Check the DELETE request. (7) Open the copied project URL and the copied session URL.
- **Test data:** Project Disposable with one session and one feedback item.
- **Expected result:** The dialog appears both times. Cancel changes nothing, but after confirming, the project disappears and DELETE returns 204. Both copied URLs show a not-found message.
- **Evidence:** `docs/evidence/TC-08/`
- **Actual result:** Not run
- **Status:** Not run

---

### TC-09: Update a project and a session
- **Requirement(s):** FR-02, FR-04 (AC-02, AC-04)
- **Test type:** Functional, Positive
- **Objective:** Verify that project and session details can be edited and persist.
- **Preconditions:** Project Aurora and session Alpha Test 1 exist.
- **Steps:** (1) Open Project Aurora and click Edit project. (2) Change the name and description and save. (3) In the sessions table click Edit on Alpha Test 1. (4) Change the game version and status and save. (5) Refresh the page. (6) Check both PUT requests.
- **Test data:** Project name: Project Aurora Updated. Description: Updated description. Session game version: v0.9.2-alpha. Session status: In Progress.
- **Expected result:** Both PUT requests return 200, and the new values show immediately and again after the refresh.
- **Evidence:** `docs/evidence/TC-09/`
- **Actual result:** Not run
- **Status:** Not run

---

### TC-10: Filter feedback
- **Requirement(s):** FR-11 (AC-09)
- **Test type:** Functional, Positive and Zero-Result Boundary
- **Objective:** Verify that the feedback filters and search return exactly the matching items.
- **Preconditions:** Dataset D1 is complete (F1 to F5).
- **Steps:** On the All Feedback page, apply each of these in turn: no filters; Status New; Priority High; Category Defect; Category Defect with Priority High; Status Resolved with Priority Critical; Clear all; search for Crash.
- **Expected result (rows shown):** 5; 3; 2; 2; 1; 0 with the no-matches message; 5; 1.
- **Evidence:** `docs/evidence/TC-10/`
- **Actual result:** Not run
- **Status:** Not run

---

### TC-11: Dashboard accuracy
- **Requirement(s):** FR-12 (AC-10)
- **Test type:** Functional, Accuracy
- **Objective:** Verify that the dashboard figures match the known data.
- **Preconditions:** Dataset D1 complete. TC-09 done (the session status is In Progress).
- **Steps:** Write the expected values below into this entry first, then open the Dashboard and compare each figure.
- **Expected values:** Projects 1; Playtest sessions 1; Feedback items 5; Open high and critical issues 3; Defects reported 2; Category: Defect 2, Usability 1, Gameplay 1, Balance 1; Status: New 3, In Progress 1, Resolved 1; Priority: Low 1, Medium 1, High 2, Critical 1; Recent sessions shows the session as In Progress with 5 feedback; the sessions-over-time chart shows 1 session in the month of the session date.
- **Evidence:** `docs/evidence/TC-11/`
- **Actual result:** Not run
- **Status:** Not run

---

### TC-12: Data survives a restart
- **Requirements:** NFR-02 (AC-15)
- **Test type:** Non-functional, Reliability
- **Objective:** Verify that saved data is still there after the backend restarts.
- **Preconditions:** Dataset D1 complete.
- **Steps:** (1) Screenshot the dashboard and feedback item F1. (2) Stop the backend with Ctrl+C. (3) Start it again. (4) Refresh the browser. (5) Compare the dashboard and F1 with the screenshots.
- **Expected result:** Every figure, name, priority and status is identical before and after.
- **Evidence:** `docs/evidence/TC-12/`
- **Actual result:** Not run
- **Status:** Not run

---

### TC-13: Boundary and unsafe input
- **Requirements:** NFR-07 (AC-18)
- **Test type:** Non-functional, Boundary, Invalid input, Security
- **Objective:** Verify that over-length, too-short, blank and unsafe input is handled without errors or script execution.
- **Preconditions:** Run after TC-12 because this adds data.
- **Steps:** Enter each input below in the stated form and submit.
| Input | Where | Expected result |
|---|---|---|
| 120-character name | New project | Accepted, 201 |
| 121-character name | New project | Rejected, 400, message shown |
| One-character name A | New project | Rejected (minimum length 2) |
| Name made only of spaces | New project | Rejected with a message on Name |
| `<script>alert('x')</script>` as the title (normal description) | Submit feedback | Accepted, shown as literal text, no alert box appears |
| `'; DROP TABLE Projects; --` as the name | New project | Stored as plain text, the project list still loads, existing projects intact |
- **Evidence:** `docs/evidence/TC-13/`
- **Actual result:** Not run
- **Status:** Not run

---

### TC-14: Response time
- **Requirement(s):** NFR-01 (AC-14)
- **Test type:** Non-functional, Performance
- **Objective:** Verify that normal operations respond within 2 seconds in the prototype test environment.
- **Preconditions:** Run after TC-13. Load each page once to warm up. Note the first request after a fresh backend start separately as the cold start.
- **Steps:** Perform each operation three times and read the Time column in DevTools Network for its API request. Record the readings below.
- **Expected result:** Every reading is 2000 ms or less.
| Operation | Run 1 (ms) | Run 2 (ms) | Run 3 (ms) | Maximum |
|---|---|---|---|---|
| Load Projects | | | | |
| Create project | | | | |
| Create session | | | | |
| Submit feedback | | | | |
| Change feedback status | | | | |
| Load Dashboard | | | | |
| Load All feedback | | | | |
- **Limits: Local machine and a small dataset, so this supports NFR-01 only for the defined prototype test environment
- **Evidence:** `docs/evidence/TC-14/`
- **Actual result:** Not run
- **Status:** Not run

---

### TC-15: Backend unavailable
- **Requirements:** Reliability and error handling (quality attribute, no single requirement)
- **Test type:** Non-functional, Error handling
- **Objective:** Verify that the UI reports a failure to the user instead of showing a blank page or failing silently.
- **Preconditions:** Frontend running.
- **Steps:** (1) Stop the backend. (2) Reload the Projects page. (3) Open New project, enter valid data and submit. (4) Start the backend and reload.
- **Expected result:** The Projects page shows an error message, not a blank page or endless loading; the dialog shows an error banner, stays open and the page does not crash; after the restart the data loads again.
- **Evidence:** `docs/evidence/TC-15/`
- **Actual result:** Not run
- **Status:** Not run

---

### TC-16: First-time user completes the core workflow
- **Requirements:** NFR-05 (AC-17)
- **Test type:** Non-functional, Usability
- **Objective:** Verify that a first-time user can create a project, a session and a defect report without help.
- **Preconditions:** A participant who has never used Checkpoint, kept anonymous as Participant 1, who agrees to take part. No coaching.
- **Steps:** Ask the participant to: (A) create a project, (B) create a playtest session, (C) submit a defect feedback item. Observe and record.
| Task | Completed unaided | Time | Hesitations or errors | Comments |
|---|---|---|---|---|
| A Create project | | | | |
| B Create session | | | | |
| C Submit defect | | | | |
- **Expected result:** All three tasks are completed without help. If help was needed, record where; that is a finding.
- **Evidence:** `docs/evidence/TC-16/`
- **Actual result:** Not run
- **Status:** Not run

---

### TC-17: Clean setup from the README
- **Requirement(s):** NFR-06 (AC-20)
- **Test type:** Non-functional, Installability
- **Objective:** Verify that the documented setup works on a clean copy of the repository.
- **Preconditions:** Stop your normal backend and frontend first, because the clean copy uses the same ports.
- **Steps:** (1) Clone the repository into a new empty folder. (2) Follow only the README, noting any step that is missing, wrong or unclear. (3) Open the app in Chrome and create a project.
- **Expected result:** The app starts on an empty database using only documented steps, and a project can be created.
- **Evidence:** `docs/evidence/TC-17/`
- **Actual result:** Not run
- **Status:** Not run

---

### TC-18: Layer separation
- **Requirement(s)**: NFR-04 (AC-19)
- **Test type:** Non-functional, Inspection.
- **Objective:** Verify that the frontend, backend and data layers are separated.
- **Preconditions:** Source code open in VS Code.
- **Steps:** (1) Search the frontend src folder for fetch( and check it appears only in api/client.ts. (2) Search the backend for CheckpointDbContext and check it appears only in controllers and Program.cs. (3) Search the backend for FromSql, ExecuteSql and SqliteConnection and check there are no results. (4) Open one controller and check it returns DTOs, not entities. (5) Screenshot both folder structures.
- **Expected result:** All four checks hold.
- **Evidence:** `docs/evidence/TC-18/`
- **Actual result:** Not run
- **Status:** Not run

---

## Test Execution Summary
| Result | Count |
| --- | --- |
| Planned | 18 |
| Executed | 0 |
| Passed | 0 |
| Failed | 0 |
| Blocked | 0 |
| Not Run | 18 |

Counts describe the final run. Failures found on an earlier run and later fixed are listed in the next section.

## Failed Test Investigation
Defect IDs refer to `docs/defect-register.md`.

| Test Case | Defect ID | Failure | Corrective Action | Regression Result |
| --- | --- | --- | --- | --- |

## Regression Testing
| Change or Defect | Test Case(s) Re-Run | Result |
| --- | --- | --- |
| UI Overhaul: Design system, dialogs, dashboard charts | TC-01, TC-05, TC-06, TC-08 | |
| DEF-01 Fix: Enum serialisation | TC-05 | |

## Requirements Traceability Matrix
| Requirement | Description | Implementation | Test Case(s) | Verification Activity | Result | Defect(s) |
| --- | --- | --- | --- | --- | --- | --- |
| FR-01 | Create project | New project dialog, POST/api/projects | TC-01, TC-02, TC-13 | To Confirm | Not Run | |
| FR-02 | View and update project | Edit project dialog, PUT | TC-09 | To Confirm | Not Run | |
| FR-03 | Create playtest session | New session dialog | TC-03 | To Confirm | Not Run | |
| FR-04 | View and update session | Edit action in the sessions table (details and status) | TC-09 | To Confirm | Not Run | |
| FR-05 | Submit feedback | Submit feedback dialog | TC-04, TC-13 | To Confirm | Not Run | DEF-05 |
| FR-06 | Defect fields required | Conditional defect fields with server validation | TC-05, TC-06 | To Confirm | Not Run | DEF-01, DEF-03 |
| FR-07 | Categorise feedback | Category chosen at submission; the API also allows recategorising, the UI does not | TC-04 | To Confirm | Not Run | |
| FR-08 | Assign priority | Priority control on each feedback item | TC-07 | To Confirm | Not Run | |
| FR-09 | Update status | Status control on each feedback item (any transition allowed) | TC-07 | To Confirm | Not Run | |
| FR-10 | View feedback | Session feedback list with expandable details, All feedback table | TC-04, TC-05, TC-10 | To Confirm | Not Run | |
| FR-11 | Filter feedback | Status, priority and category filters and title search; a session filter exists in the API only | TC-10 | To Confirm | Not Run | |
| FR-12 | Dashboard/quality overview | Dashboard counts, charts and recent sessions | TC-11 | To Confirm | Not Run | |
| FR-13 | Delete with confirmation and cascade | Confirmation dialog, cascade delete | TC-08 | To Confirm | Not Run | |
| NFR-01 | Response time of 2 seconds or less | Measured, not built | TC-14 | To Confirm | Not Run | |
| NFR-02 | Persistence across restarts | SQLite via EF Core | TC-12 | To Confirm | Not Run | |
| NFR-03 | Chrome on Windows | Environment of every test | All | To Confirm | Not Run | |
| NFR-04 | Layer separation | React frontend, ASP.NET Core API, EF Core data layer | TC-18 | To Confirm | Not Run | |
| NFR-05 | First-time usability | Dialog-based core workflow | TC-16 | To Confirm | Not Run | |
| NFR-06 | Documented setup | README | TC-17 | To Confirm | Not Run | |
| NFR-07 | Input validation and sanitisation | DTO validation, output encoding, parameterised queries | TC-02, TC-06, TC-13 | To Confirm | Not Run | |

## Remaining Quality Risks
| Risk | Description | Mitigation |
| --- | --- | --- |
| No automated tests | The current test cases are manual and require human execution. Regressions must be caught manually. | Add unit and integration tests. |
| API address is hardcoded | The API address is currently hardcoded in the frontend, which may cause issues if the backend is moved or deployed to a different environment. | Refactor the frontend to use a configuration file or environment variable for the API address. |
| Performance measured on a small local dataset | The performance tests are conducted on a small dataset and may not reflect real-world usage with larger datasets. | Conduct performance testing with larger datasets. |
| One usability participant | The usability tests were conducted with only one participant, which may not provide a comprehensive view of user experience. | Conduct usability testing with a larger and more diverse group of participants. |
| No authentication | The current implementation does not include authentication, which means anyone with access can change data. | Out of scope: Add if deployed beyond local use. |
| No session filter in the UI | FR-11 is only partially implemented, as the session filter is only available in the API and not in the UI. | Add a session filter to the UI. |
| Sanitisation relies on output encoding and parameterised queries | Input is stores as it is typed. | Consider server-side sanitisation. |
| Chrome on Windows only and accessibility not formally tested | Other browsers, operating systems and assistive technologies are unverified. | Add cross-browser and accessibility testing |

## Traceability Notes
Traceability supports quality assurance and change management by providing a clear mapping of requirements to test cases. This provides developers with an overview of requirement coverage, enabling the identification of coverage gaps and the introduction of new test cases.
Change management is also supported by the traceability matrix, as it allows developers to track which test cases will need to be updated if a requirement change is undertaken.