# Test Strategy
Checkpoint is a locally-hosted quality assurance and playtesting management application that allows developers to track and manage feedback received from playtesters. It uses React, ASP.NET Core API, and SQLite.

## Purpose
The following test strategy outlines the approach that will be used to verify the validity and reliability of the Checkpoint prototype. Testing will focus primarily on the React frontend, corresponding interaction with the ASP.NET Core API, data validation, CRUD operations, feedback workflows and navigation.

The objective of this testing approach is to validate that business functions, system component integration, invalid input, and data persistence are all handled correctly. This approach will allow for defects to be found early, and will provide confidence that functional and non-functional requirements have been met.

## Scope
**In scope:**  
- Project creation, editing and deletion (FR-01, FR-02)
- Playtest session creation, editing and deletion (FR-03, FR-04)
- Feedback submission including conditional defect fields (FR-05, FR-06, FR-07)
- Issue tracking and triaging (FR-08, FR-09)
- Feedback viewing and filtering (FR-10, FR-11)
- Dashboard loading and display of quality overview (FR-12)
- Deletion with confirmation and cascade (FR-13)
- Clear and usable navigation (NFR-05)
- Error handling (NFR-06, NFR-07)
- Data persistence (NFR-02)
- Execution within the approved environment (NFR-03)

**Out of scope:**
- Authentication/authorisation: Explicitly excluded from prototype scope as per the project brief. No user accounts exist, so access control testing is not currently applicable.
- Load/concurrency testing: As a single-developer local tool rather than a multi-user production system, this remains out of scope for this prototype.
- Cross-browser testing: NFR-03 explicitly scopes this prototype to Chrome on Windows only.
- Penetration testing: As the prototype is intended for local development, penetration testing is out of scope. Basic security-related validation and safe handling of user input remain in scope.

## Test Levels
| Level		  | Applied in Checkpoint						  | Reason														| Example |
| ----------- | --------------------------------------------- | ----------------------------------------------------------- | ------- |
| Unit		  | Planned for future automated testing		  | Validate isolated backend or frontend logic where possible. | Test `FeedbackDto`'s conditional validation logic (FR-06). |
| Integration | Performed manually during development		  | Verify React, API, and Database interactions				| Confirm cascade delete removes child sessions/feedback when a project is deleted. | 
| System	  | Performed manually, end-to-end through the UI | Verify complete user workflows								| Core workflow walkthrough: create project → create playtest session → submit feedback → triage → confirm dashboard reflects changes. | 
| Acceptance  | Informal self-acceptance against the FR table | Confirm the prototype meets its requirements				| Each functional requirement checked against its wording as the acceptance criterion. |

## Test Types
The following test types have been considered based on the requirements and risks associated with Checkpoint. Functional testing is the primary focus of the initial test cases. Remaining test types are included where they can be addressed realistically within the prototype environment.

The purpose of this section is to define the overall testing strategy. Not every test type listed below will result in a separate test case during the initial testing phase.

**Primary Testing**
- **Functional testing**: Testing whether features behave as expected.
The primary focus of this test strategy and current testing implementation, as most functional requirements describe direct business behaviour including creating, viewing, updating and deleting projects, sessions and feedback.
- **API/Integration testing**: Verifies that the React frontend, ASP.NET Core API and SQLite data layer interact correctly. This includes checking requests, status codes, response structures and validation errors.
	- This was exercised during development, including diagnosing a mismatched API base URL that caused requests to fail without an immediately visible application error.
- **Input validation / negative testing**: Verifies that invalid input is rejected correctly. This particularly targets NFR-07 and the conditional defect-field behaviour outlined in FR-06.

**Supporting Testing**
- **Database testing**: Checks persistence, relationships and cascade-delete behaviour between models/entities within the application. This can also be verified through code inspection and database behaviour.
- **Usability testing**: Considers whether a first-time user can understand the core workflow of Checkpoint and navigate through all the pages without complication.
- **Compatibility testing**: Ensures the application builds and runs as expected on the outlined environment from NFR-03. In the case of Checkpoint, it has been limited to Google Chrome on Windows. Other operating systems and browsers are outside the formal scope of testing.
- **Regression testing (manual)**: Rerun important existing workflows after large changes to confirm previous functionality remains.

**Deferred / Limited Testing**
- **Security:**: Basic input-handling security is tested in TC-13 using boundary lengths, markup and script input, and SQL-like text. Authentication, authorisation and penetration testing remain out of scope because the prototype has no user accounts.
- **Performance:**: Performance is tested in TC-14 by measuring API response times in the Chrome DevTools Network panel against the two second threshold in NFR-01, on the local prototype environment with a small dataset. Load and stress testing remain out of scope.

## Functional Testing Approach
Functional testing will form the primary focus of the initial test cases. The techniques below will be used where they provide useful coverage, but not every technique will result in a separate test case.
- **Scenario testing**: This will be the primary focus of the initial test cases. Testing/verifying complete user workflows rather than isolated operations. A focus will be placed on completing the core workflow of creating a project, creating a session, submitting feedback, triaging feedback and viewing the resulting information on the dashboard.
- **Equivalence partitioning**: Feedback categories can be partitioned into Defect and non-Defect categories because FR-06 applies different validation rules to each of these groups.
- **Boundary value analysis**: Applies to fields with defined length limits, testing values at, just below and just above the relevant boundary. (e.g. Project Names, Playtest Session Names, etc).
- **Decision-table testing**: Applies to the conditional defect validation in FR-06. The combinations of Category = Defect/non-Defect and defect field = populated/blank should produce predictable valid or invalid outcomes.
- **State-transition testing**: Applies to feedback status changes such as New, InProgress, Resolved and Rejected.
	- Note: The current implementation permits transitions between statuses without enforcing a particular sequence. This needs to be noted and addressed in future development.

Overall, functional coverage will concentrate on project, session, feedback, filtering and dashboard workflows, with particular attention placed on CRUD operations, conditional validation, triage and destructive actions.

## Non-Functional Testing Approach
Non-functional requirements will be addressed using a combination of direct testing, informal observation and code inspection where possible. Key non-functional requirements are addressed below.
- **NFR-01 - Performance**: The two-second response target will be tested by measuring API response times in the Chrome DevTools Network panel.
- **NFR-02 - Persistence**: Persistence will be checked by restarting the backend and confirming previously stored projects, sessions and feedback remain available.
- **NFR-03 - Compatibility**: The application will be tested within the specified Chrome/Windows environment. Cross-browser and cross-platform testing are outside the scope of this prototype.
- **NFR-05 - Usability**: Usability is tested in TC-16 as a task-based observation of a first-time user completing project creation, session creation and defect submission without help.
- **NFR-07 - Validation**: Input validation will be tested through negative scenarios including blank required fields, white-space only values and incomplete defect submissions.

## Entry and Exit Criteria
**Entry criteria:**  
*The following criteria must be satisfied before the testing phase begins.*
- Requirements are sufficiently defined.
- The backend builds and runs without blocking errors.
- Database migrations are applied.
- Frontend connects successfully to the backend.
- Required test data and/or a clean test database are available.

**Exit criteria:**  
*The following conditions will be used to decide whether testing is sufficiently complete.*
- At least fifteen of the eighteen planned tests are executed. Any test not run is recorded as Blocked with a reason.
- Every test covering FR-01 to FR-09 and FR-13 passes on the final run.
- At least 90% of executed tests pass on the final run.
- No Critical or High severity defect remains open. Open Medium and Low defects are justified under Remaining Quality Risks.
- Every failed test has a defect ID, a corrective action and a retest result.
- Every requirement maps to at least one test or a written justification.
- Every measured response time for NFR-01 is 2 seconds or less.

## Environment, Tools and Dependencies
| Area             | Environment/Tool							 |
| ---------------- | ------------------------------------------- |
| Frontend         | React, TypeScript, Vite					 |
| Backend          | ASP.NET Core Web API						 |
| Database         | SQLite										 |
| Browser          | Chrome (Version 137.0.7151.104 (64-bit))    |
| API Testing      | Browser DevTools (Network/Console), OpenAPI |
| IDE              | Visual Studio								 |
| Source Control   | Git, GitHub                                 |
| Operating System | Windows 11									 |
| Runtime		   | Node.js, .NET 10 SDK						 |
| Testing Data     | Manually created sample data entered during testing, no seeded or synthetic dataset used. |
| Dependencies     | React Router, OpenAPI, EF Core				 |
