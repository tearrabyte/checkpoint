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

## Test Data (Dataset D1)
The test data used in the test cases involves one project, one session and five feedback items, built up incrementally through the test cases.

| Item | Title | Category | Priority | Status | Created In |
|---|---|---|---|---|---|
| F1 | Menu confusing | Usability | High | In Progress | TC-04, then changed in TC-07 |
| F2 | Crash on load | Defect | Critical | New | TC-05 |
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
- **Evidence:** Report Appendix A. Also confirmed by `Api.Tests.CreateProject_WithValidData_Returns201`
- **Actual result:** Dialog closed, Projct Aurora is visible in the list of projects with zero sessions, and the POST returned 201.
- **Status:** Pass

---
### TC-02: Reject a blank project name
- **Requirement(s):** FR-01, NFR-07 (AC-18)
- **Test type:** Functional, Negative
- **Objective:** Verify that a project with a blank required field is rejected, not silently accepted.
- **Preconditions:** Project Aurora exists.
- **Steps:** (1) Click New Project. (2) Leave Name blank and enter a description. (3) Click Create Project. (4) Check the POST request in DevTools Network.
- **Test data:** Name: (blank). Description: Test project with blank name.
- **Expected result:** The dialog stays open, an error appears under Name, the POST returns 400, and no new project appears in the list.
- **Evidence:** Report Appendix A. Also confirmed by `Api.Tests.CreateProject_WithBlankName_Returns400WithNameError`
- **Actual result:** Dialog remained open, error appeared under Project Name, and the POST returned 400. No new project appeared in the list.
- **Status:** Pass

---

### TC-03: Create a playtest session
- **Requirement(s):** FR-03 (AC-03)
- **Test type:** Functional, Positive
- **Objective:** Verify that a session can be created and is associated with its project.
- **Preconditions:** Project Aurora exists.
- **Steps:** (1) Open Project Aurora. (2) Click New Session. (3) Enter the test data and click Create Session. (4) Check the POST request in DevTools Network.
- **Test data:** Name: Alpha Test 1. Date: 15 September 2026. Game Version: v0.9.1-alpha. Notes: (blank).
- **Expected result:** The POST returns 201, and the sessions table shows Alpha Test 1 with status Planned and 0 feedback.
- **Evidence:** Report Appendix A. Also confirmed by `Api.Tests.CreateSession_Returns201WithReadableStatus`
- **Actual result:** Session table showed Alpha Test 1 with 'Planned' status and 0 feedback. POST returned 201.
- **Status:** Pass

---

### TC-04: Submit general feedback
- **Requirement(s):** FR-05, FR-07, FR-10 (AC-05)
- **Test type:** Functional, Positive
- **Objective:** Verify that non-defect feedback can be submitted and categorised without defect-only fields.
- **Preconditions:** Session Alpha Test 1 exists.
- **Steps:** (1) Open the session. (2) Click Submit Feedback. (3) Enter the test data and submit. (4) Check the POST request in DevTools Network.
- **Test data:** Title: Menu confusing. Description: Main menu items are not intuitive. Name: (blank). Category: Usability. Priority: Medium.
- **Expected result:** The POST returns 201, the item appears in the list with a Usability badge, and the four defect fields were neither shown nor required.
- **Evidence:** Report Appendix A.
- **Actual result (run 1):** Submission succeeded and feedback was created correctly (201, item appeared in list), but typing in the Title/Description fields repeatedly moved keyboard focus to the dialog's close button, making text entry very difficult. This is a usability defect, not a functional blocker — the feedback could still be entered with effort. Logged as DEF-07.
- **Actual result (run 2):** Submission succeeded and feedback was created correctly (201, item appeared in list), but typing in the Title/Description fields repeatedly moved keyboard focus to the dialog's close button, making text entry very difficult. This is a usability defect, not a functional blocker — the feedback could still be entered with effort. Logged as DEF-07.
- **Status:** Fail (run 1), Pass (run 2)

---

### TC-05: Submit and view a valid defect
- **Requirement(s):** FR-06, FR-10 (AC-06, AC-08)
- **Test type:** Functional, Positive
- **Objective:** Verify that a complete defect report is accepted, stored and displayed with all four reproduction fields.
- **Preconditions:** Session Alpha Test 1 exists.
- **Steps:** (1) Click Submit Feedback. (2) Choose Category Defect; four extra fields appear. (3) Enter the test data and submit. (4) Click the new item to expand it.
- **Test data:** Title: Crash on load. Description: Game crashes when loading level. Category: Defect. Priority: Critical. Expected behaviour: Level loads normally. Actual behaviour: App exits with error 0xDEAD. Reproduction steps: 1. Launch; 2. Load level X; 3. Observe crash. Environment: Windows 11, RTX 3060
- **Expected result:** The POST returns 201, the item shows a Defect badge, and the expanded item displays all four defect fields as entered.
- **Evidence:** Report Appendix A. Also confirmed by `Api.Tests.SubmitDefect_WithAllFields_Returns201`
- **Actual result:** POST returned 201, the item shows in the feedback list with a Defect badge, and when expanded all four defect fields were displayed as entered.
- **Status:** Pass

---

### TC-06: Reject an incomplete defect
- **Requirement(s):** FR-06 (AC-06).
- **Test type:** Functional, Negative
- **Objective:** Verify that a defect report missing its reproduction information is rejected.
- **Preconditions:** Session Alpha Test 1 exists.
- **Steps:** (1) Click Submit feedback. (2) Enter the test data and choose Category Defect. (3) Leave the four defect fields blank and submit. (4) Check the request in DevTools Network
- **Test data:** Title: Crash on load. Description: Game crashes. Category: Defect.
- **Expected result:** The dialog stays open, a message says four defect details are still needed, an error appears under each of the four fields, the POST returns 400, and the feedback count does not change.
- **Evidence:** Report Appendix A. Also confirmed by `Api.Tests.SubmitDefect_WithoutDefectFields_Returns400ForEachField`
- **Actual result:** Dialog remained open with a banner message stating four defect details were still needed, errors appeared under all four defect fields. The POST returned 400 and the feedback count did not change.
- **Status:** Pass

---

### TC-07: Triage priority and status
- **Requirement(s):** FR-08, FR-09 (AC-07)
- **Test type:** Functional, Positive
- **Objective:** Verify that a developer can change an item's priority and status, and that the change persists.
- **Preconditions:** Feedback item Menu confusing exists in session Alpha Test 1.
- **Steps:** (1) Click Menu confusing to expand it. (2) Set Priority to High. (3) Set Status to In Progress. (4) Refresh the page and expand the item again. (5) Check both PUT requests in DevTools Network.
- **Test data:** Priority: High. Status: In Progress.
- **Expected result:** Each change returns 200 from the PUT, and after the refresh the item still shows High and In Progress.
- **Evidence:** Report Appendix A. Also confirmed by `Api.Tests.TriageFeedback_PersistsPriorityAndStatus`
- **Actual result:** Changes returned 200, and after a refresh the item still showed High and In Progress
- **Status:** Pass

---

### TC-08: Delete a project with confirmation and cascade
- **Requirement(s):** FR-13 (AC-11, AC-12, AC-13)
- **Test type:** Functional, Alternative Flow
- **Objective:** Verify that deletion needs confirmation, can be cancelled, and removes the project with its sessions and feedback.
- **Preconditions:** Create a throwaway project called Disposable with one session and one feedback item (any data). Copy the project URL and the session URL before deleting.
- **Steps:** (1) Open Projects. (2) Click Delete on Disposable. (3) In the dialog click Cancel. (4) Check the project is still listed. (5) Click Delete again and confirm. (6) Check the DELETE request. (7) Open the copied project URL and the copied session URL.
- **Test data:** Project Disposable with one session and one feedback item.
- **Expected result:** The dialog appears both times. Cancel changes nothing, but after confirming, the project disappears and DELETE returns 204. Both copied URLs show a not-found message.
- **Evidence:** Report Appendix A. Also confirmed by `Api.Tests.DeleteProject_RemovesItsSessionsAndFeedback`
- **Actual result:** Dialog appeared both times. Cancel changed nothing, whereas confirm resulted i the project disappearing from the list, and a DELETE returning 204. Both copied URLs displayed a not-found message.
- **Status:** Pass

---

### TC-09: Update a project and a session
- **Requirement(s):** FR-02, FR-04 (AC-02, AC-04)
- **Test type:** Functional, Positive
- **Objective:** Verify that project and session details can be edited and persist.
- **Preconditions:** Project Aurora and session Alpha Test 1 exist.
- **Steps:** (1) Open Project Aurora and click Edit project. (2) Change the name and description and save. (3) In the sessions table click Edit on Alpha Test 1. (4) Change the game version and status and save. (5) Refresh the page. (6) Check both PUT requests.
- **Test data:** Project name: Project Aurora Updated. Description: Updated description. Session game version: v0.9.2-alpha. Session status: In Progress.
- **Expected result:** Both PUT requests return 200, and the new values show immediately and again after the refresh.
- **Evidence:** Report Appendix A.
- **Actual result:** PUT requests returned 200, new values displayed immediately and remained after a refresh.
- **Status:** Pass

---

### TC-10: Filter feedback
- **Requirement(s):** FR-11 (AC-09)
- **Test type:** Functional, Positive and Zero-Result Boundary
- **Objective:** Verify that the feedback filters and search return exactly the matching items.
- **Preconditions:** Dataset D1 is complete (F1 to F5).
- **Steps:** On the All Feedback page, apply each of these in turn: no filters; Status New; Priority High; Category Defect; Category Defect with Priority High; Status Resolved with Priority Critical; Clear all; search for Crash.
- **Expected result (rows shown):** 5; 3; 2; 2; 1; 0 with the no-matches message; 5; 1.
- **Evidence:** Report Appendix A. Also confirmed by `Api.Tests.Filters_ReturnOnlyMatchingItems`
- **Actual result:** Results matched the expected output for all filters and search.
- **Status:** Pass

---

### TC-11: Dashboard accuracy
- **Requirement(s):** FR-12 (AC-10)
- **Test type:** Functional, Accuracy
- **Objective:** Verify that the dashboard figures match the known data.
- **Preconditions:** Dataset D1 complete. TC-09 done (the session status is In Progress).   
- **Steps:** Open the Dashboard and compare each figure to the expected values below.
- **Expected values:** Projects 1; Playtest sessions 1; Feedback items 5; Open high and critical issues 3; Defects reported 2; Category: Defect 2, Usability 1, Gameplay 1, Balance 1; Status: New 3, In Progress 1, Resolved 1; Priority: Low 1, Medium: 0, High 2, Critical 2; Recent sessions shows the session as In Progress with 5 feedback; the sessions-over-time chart shows 1 session in the month of the session date.
- **Evidence:** Report Appendix A. Also confirmed by `Api.Tests.Dashboard_TotalsIncreaseByTheDataAdded`
- **Actual result:** Dashboard displayed the correct number of projects, sessions, feedback items, as well as high and critical issues, defects reported, feedback count by category, status, and priority, as well as playtest sessions over time and recent session information. 
- **Status:** Pass

---

### TC-12: Data survives a restart
- **Requirements:** NFR-02 (AC-15)
- **Test type:** Non-functional, Reliability
- **Objective:** Verify that saved data is still there after the backend restarts.
- **Preconditions:** Dataset D1 complete.
- **Steps:** (1) Screenshot the dashboard and feedback item F1. (2) Stop the backend with Ctrl+C. (3) Start it again. (4) Refresh the browser. (5) Compare the dashboard and F1 with the screenshots.
- **Expected result:** Every figure, name, priority and status is identical before and after.
- **Evidence:** Report Appendix A.
- **Actual result:** Figures, names, priority status etc. remain identical after the restart.
- **Status:** Pass

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
- **Evidence:** Report Appendix A. Also confirmed by `Api.Tests.CreateProject_BoundaryAndUnsafeInput_IsHandledCorrectly`
- **Actual result:** 120-character name, markdown text and sql-like text were all accepted and rendered as normal text. 121-character name, 1-character name and a name consisting of only spaces was rejected.
- **Status:** Pass

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
| Load Projects | 4 | 3 | 2 | 4 |
| Create project | 14 | 13 | 12 | 14 |
| Create session | 22 | 13 | 141 | 141 |
| Submit feedback | 51 | 115 | 13 | 115 |
| Change feedback status | 26 | 14 | 14 | 26 |
| Load Dashboard | 4 | 7 | 8 | 8 |
| Load All feedback | 12 | 4 | 2 | 12 |

**Cold Start**: 249ms

- **Limits:** Local machine and a small dataset, so this supports NFR-01 only for the defined prototype test environment
- **Evidence:** Appendix A.
- **Actual result:** All readings remained below 2000ms.
- **Status:** Pass

---

### TC-15: Backend unavailable
- **Requirements:** Reliability and error handling (quality attribute, no single requirement)
- **Test type:** Non-functional, Error handling
- **Objective:** Verify that the UI reports a failure to the user instead of showing a blank page or failing silently.
- **Preconditions:** Frontend running.
- **Steps:** (1) Stop the backend. (2) Reload the Projects page. (3) Open New project, enter valid data and submit. (4) Start the backend and reload.
- **Expected result:** The Projects page shows an error message, not a blank page or endless loading; the dialog shows an error banner, stays open and the page does not crash; after the restart the data loads again.
- **Evidence:** Report Appendix A.
- **Actual result:** Projects page shows an error message correctly, submitting a valid project results in a dialog error message being displayed. The dialog stays open and the page does not crash. After restarting, the data loads again and the submission goes through.
- **Status:** Pass

---

### TC-16: First-time user completes the core workflow
- **Requirements:** NFR-05 (AC-17)
- **Test type:** Non-functional, Usability
- **Objective:** Verify that a first-time user can create a project, a session and a defect report without help.
- **Preconditions:** A participant who has never used Checkpoint, kept anonymous as Participant 1, who agrees to take part. No coaching.
- **Steps:** Ask the participant to: (A) create a project, (B) create a playtest session, (C) submit a defect feedback item. Observe and record.

| Task | Completed unaided | Time | Hesitations or errors | Comments |
|---|---|---|---|---|
| A Create project | Yes | 33.56s | None | Participant confidently navigated to the Projects page and spotted the New project button quickly. They read placeholder text before coming up with a short idea and entering it. |
| B Create session | Yes | 44.86s | None | First attempted to click the back panel of the project, but noticed the button immediately after and navigated to the project page. Already expected the button in the top right so moved confidently. Took time to read the session dialog and enter input. |
| C Submit defect | Yes | 1m 37.08s| None | Easily found the add feedback button and begun the entry. Spent some time considering what to write and exploring the different category options. Upon exploring all options, the participant returned to Defect and successfully submitted the form.  |
- **Expected result:** All three tasks are completed without help. If help was needed, record where.
- **Evidence:** Results table seen above.
- **Actual result:** All three tasks were completed by the participant without assistance.
- **Status:** Pass

---

### TC-17: Clean setup from the README
- **Requirement(s):** NFR-06 (AC-20)
- **Test type:** Non-functional, Installability
- **Objective:** Verify that the documented setup works on a clean copy of the repository.
- **Preconditions:** Stop the backend and frontend, because the clean copy uses the same ports.
- **Steps:** (1) Clone the repository into a new empty folder. (2) Follow only the README, noting any step that is missing, wrong or unclear. (3) Open the app in Chrome and create a project.
- **Expected result:** The app starts on an empty database using only documented steps, and a project can be created.
- **Evidence:** Report Appendix A.
- **Actual result (run 1):** The repository was successfully cloned, however the backend dotnet run requires an additional --project .\Checkpoint.Api. Frontend and project creation worked as expected. Logged as DEF-08.
- **Actual result (run 2):** The repository was successfully cloned, backend and frontent run with no errors and a project can be created as expected.
- **Status:** Fail (run 1), Pass (run 2)

---

### TC-18: Layer separation
- **Requirement(s)**: NFR-04 (AC-19)
- **Test type:** Non-functional, Inspection.
- **Objective:** Verify that the frontend, backend and data layers are separated.
- **Preconditions:** Source code open in VS Code.
- **Steps:** (1) Search the frontend src folder for fetch( and check it appears only in api/client.ts. (2) Search the backend for CheckpointDbContext and check it appears only in controllers and Program.cs. (3) Search the backend for FromSql, ExecuteSql and SqliteConnection and check there are no results. (4) Open one controller and check it returns DTOs, not entities. (5) Screenshot both folder structures.
- **Expected result:** All four checks hold.
- **Evidence:** Report Appendix A.
- **Actual result:** Searching for fetch( in the frontend only resulted in api/client.ts. Searching CheckpointDbContext in the backend only shows controllers and Program.cs. Backend search results for FromSql, ExecuteSql and SqliteConnection returned nothing. Controllers return DTOs. Folder structure is visible in GitHub.                                                                 
- **Status:** Pass

---

## Test Execution Summary
| Result | Count |
| --- | --- |
| Planned | 18 |
| Executed | 18 |
| Passed | 18 |
| Failed | 0 |
| Blocked | 0 |
| Not Run | 0 |

Counts describe the final run. Failures found on an earlier run and later fixed are listed in the next section.

## Failed Test Investigation
| Test Case | Defect ID | Failure | Corrective Action | Regression Result |
| --- | --- | --- | --- | --- |
| TC-04 | DEF-07 | Typing in the feedback dialog caused keyboard focus to jump to the close button because the focus-management effect reran when the onClose callback reference changed. | Corrected the focus-management effect to prevent unnecessaru refocusing during parent re-renders and form input. | TC-04 rerun passed. |
| TC-17 | DEF-08 | README setup instructions used `dotnet run` rather than explicitly targeting the API project. | Updated the command to `dotnet run --project .\Checkpoint.Api` and verified the setup on a clean clone. | TC-17 passed upon re-run.

Defect IDs refer to `docs/defect-register.md`.

No test case in this document failed on the final run. All 18 test cases passed. See the Test Execution Summary above. DEF-06 was found by automated testing, discovered in `docs/test-automation.md` and fixed in `docs/defect-register.md`, rather than disucssed here, since no manual test case in this document failed because of it.  

## Regression Testing
| Change or Defect | Test Case(s) Re-Run | Result |
| --- | --- | --- |
| UI Overhaul: Design system, dialogs, dashboard charts | TC-01, TC-05, TC-06, TC-08 (manual). Automated `CreateProject_WithValidData_Returns201`, `SubmitDefect_WithAllFields_Returns201`, `SubmitDefect_WithoutDefectFields_Returns400ForEachField`, `DeleteProject_RemovesItsSessionsAndFeedback` | Automated: All pass. Manual: Pass |
| DEF-01 Fix: Enum serialisation | TC-03, TC-05 (manual). Automated `CreateSession_Returns201WithReadableStatus` | Automated: Pass. Manual: Pass |
| DEF-06 Fix: FeedbackUpdateDto validation | TC-06 (manual). Automated `RecategoriseToDefect_WithoutDefectFields_Returns400`, `Update_RecategorisedToDefect_WithoutDefectFields_ReportsAllFourFields`. | Automated: Both pass. Manual: Pass | 
| DEF-07 Fix: Dialog focus management | TC-04 (manual). | Pass |
| DEF-08 Fix: README startup command | TC-17 (manual). | Pass |

All automated tests were rerun during regression testing and passed.

## Requirements Traceability Matrix
This matrix summarises verification status for each requirement from both automated and manual testing. Automated test names, counts and run evidence are recorded in `docs/test-automation.md`. Manual test case detail and results are recorded above in this document. The Result column here reflects both.

| Requirement | Description | Implementation | Test Case(s) | Verification Activity | Result | Defect(s) |
| --- | --- | --- | --- | --- | --- | --- |
| FR-01 | Create project | New project dialog, POST/api/projects | TC-01, TC-02, TC-13 | Automated and manual | Automated: Pass. Manual: Pass | |
| FR-02 | View and update project | Edit project dialog, PUT | TC-09 | Manual | Pass | |
| FR-03 | Create playtest session | New session dialog | TC-03 | Automated and manual | Automated: Pass. Manual: Pass | |
| FR-04 | View and update session | Edit action in the sessions table (details and status) | TC-09 | Manual | Pass | DEF-05 |
| FR-05 | Submit feedback | Submit feedback dialog | TC-04, TC-13 | Manual | Pass | DEF-07 |
| FR-06 | Defect fields required | Conditional defect fields with server validation | TC-05, TC-06 | Automated and manual | Automated: Pass. Manual: Pass | DEF-01, DEF-03, DEF-06 |
| FR-07 | Categorise feedback | Category chosen at submission; the API also allows recategorising, the UI does not | TC-04 | Manual | Pass | |
| FR-08 | Assign priority | Priority control on each feedback item | TC-07 | Automated and manual | Automated: Pass. Manual: Pass | |
| FR-09 | Update status | Status control on each feedback item (any transition allowed) | TC-07 | Automated and manual | Automated: Pass. Manual: Pass | |
| FR-10 | View feedback | Session feedback list with expandable details, All feedback table | TC-04, TC-05, TC-10 | Automated (partial) and manual | Automated: Pass (TC-05, TC-10 only). Manual: Pass | |
| FR-11 | Filter feedback | Status, priority and category filters and title search; a session filter exists in the API only | TC-10 | Automated and manual | Automated: Pass. Manual: Pass | |
| FR-12 | Dashboard/quality overview | Dashboard counts, charts and recent sessions | TC-11 | Automated and manual | Automated: Pass. Manual: Pass. | |
| FR-13 | Delete with confirmation and cascade | Confirmation dialog, cascade delete | TC-08 | Automated (cascade only) and manual | Automated: Pass. Manual: Pass | |
| NFR-01 | Response time of 2 seconds or less | Measured, not built | TC-14 | Manual | Pass | |
| NFR-02 | Persistence across restarts | SQLite via EF Core | TC-12 | Manual | Pass | |
| NFR-03 | Chrome on Windows | Environment of every test | All | Manual | Pass | |
| NFR-04 | Layer separation | React frontend, ASP.NET Core API, EF Core data layer | TC-18 | Manual | Pass | |
| NFR-05 | First-time usability | Dialog-based core workflow | TC-16 | Manual | Pass | |
| NFR-06 | Documented setup | README | TC-17 | Manual | Pass | DEF-08 |
| NFR-07 | Input validation and sanitisation | DTO validation, output encoding, parameterised queries | TC-02, TC-06, TC-13 | Automated (partial) and manual | Automated: Pass (TC-02, TC-06 only). Manual: Pass | |

## Remaining Quality Risks
| Risk | Description | Mitigation |
| --- | --- | --- |
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