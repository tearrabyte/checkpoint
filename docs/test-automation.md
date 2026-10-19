# Test Automation

## Purpose
This document records the automated testing approach used for Checkpoint, including the test cases selection for automation, execution results, evidence, benefits, limitations and maintainability considerations.

## Test Automation Approach
Selected manual test cases were automated with MSTest in `backend/Checkpoint.Api.Tests`. Test suitability for automation was deduced by evaluating the stability, repeatability, speed and risk of candidate tests. Tests that require a person, process restart or real browser were specifically kept manual.

Unit tests check the conditional defect
## Test Cases Selected for Automation
| Test Case ID | Description | Rationale for Automation | Automation Type | Automation Status | Automated By |
| --- | --- | --- | --- | --- |
| TC-01 | Create a valid project | Stable and fast. Runs on every change | API Integration | Implemented | CreateProject_WithValidData_Returns201 |
| TC-02 | Reject a blank project name | Negative path that is easy to repeat | API Integration | Implemented | CreateProject_WithBlankName_Returns400WithNameError |
| TC-03 | Create a playtest session | Core workflow. Guards string enum output (DEF-01) | API Integration | Implemented | CreateSession_Returns201WithReadableStatus |
| TC-05 | Submit a valid defect | Highest-risk rule (FR-06) | API Integration | Implemented | SubmitDefect_WithAllFields_Returns201 |
| TC-06 | Reject an incomplete defect | Highest-risk rule with several combinations | Unit and API Integration | Implemented | SubmitDefect_WithoutDefectFields_Returns400ForEachField and FeedbackValidationTests |
| TC-07 | Triage priority and status | Core workflow. Checks the change persists. | API Integration | Implemented | TriageFeedback_PersistsPriorityAndStatus |
| TC-08 | Delete a project with cascade | Data integrity rule. The confirmation dialog stays manual | API Integration (Cascade only) | Implemented | DeleteProject_RemovesItsSessionsAndFeedback |
| TC-10 | Filter feedback | Many combinations, ideal to repeat | API Integration | Implemented | Filters_ReturnOnlyMatchingItems |
| TC-11 | Dashboard accuracy | Numbers are easy to assert. | API Integration | Implemented | Dashboard_TotalsIncreaseByTheDataAdded |
| TC-13 | Project name input boundaries | Boundaries are easily repeatable. Script text rendering needs a browser, so stays manual. | API Integration (Boundaries only) | Implemented | CreateProject_BoundaryAndUnsafeInput_IsHandledCorrectly |
| DEF-06 | Recategorise feedback to Defect without defect fields | Regression guard for DEF-06 | Unit and API Integration | Implemented | RecategoriseToDefect_WithoutDefectFields_Returns400 |

## Automated Test Results
| Metric | First Run | Final Run
| --- | --- |
| Automated Tests Planned | 16 | 17 |
| Automated Tests Executed | 16 | 17 |
| Automated Tests Passed | 15 | 17 |
| Automated Tests Failed | 1 | 0 |
| Duration | 4.7 seconds | 1.7 seconds |

The first run failed 1 test, exposing DEF-06 (the update validation was never run). After the fix all 17 pass.

The number of automated tests does not match the number of rows in the table above. One case can be covered by several automated tests.

## Benefits
Automated tests provide a standard, efficient, and reliable way of repeatedly testing core workflows within an application. The implemented test suite for Checkpoint provides value by allowing tests to be run in seconds with a single command, which produce the same result each time. This automated workflow is also able to connect with GitHub, enabling each push to run the tests once more so a regression is caught without the need for prompted testing. Furthermore, the tests use an in-memory database, so that tests are isolated from real data.

Such testing also allowed defects to be automatically guarded, such as the case for DEF-01 and DEF-06.

## Limitations
While providing many benefits in the form of automated testing, the test suite implemented for Checkpoint has real limitations. There are no automated checks of the React screens within a real browser context. Tests also call the API in memory, rather than a deployed server. Similarly CI implementation, although running on Windows, does not use the target environment with Chrome. Hence, NFR-03 remains a manual check. Similarly, performance (NFR-01) is not automated as timings may be unreliable on a CI runner.

`react-hooks/set-state-in-effect` is downgraded to a warning. It flags the standard fetch-on-mount pattern used throughout the app's pages. Adopting a data-fetching library to satisfy it was judged out of scope for this prototype. The warning remains visible in  `npm run lint` output rather than being silenced.
Most notably, there is no code coverage measurement beyond requirement coverage, which must be considered when deeming overall project quality metrics.

## Maintainability
Maintainability has been considered when implementing the automated test suite. Shared helpers for creation of projects, sessions and feedback allow for tests to be kept short. Test names and comments are used to outline which manual test case each test automates. Furthermore, tests such as the dashboard test compare totals before and after rather than comparing exact numbers, which allows the test to continue working when other tests add data.

A noted limitation is that routes and field names appear as text in the automated test suite, meaning that renaming an endpoint or DTO field would require tests to be edited to reflect this. Improvements could also include splitting tests further into one file per area.

## Manual and Exploratory Testing
Upon evaluation, some test cases were not considered suitable for automation. Key factors were the need for a person, a process restart, unreliable timings, a real browser, and review activities.

| Test Case ID | Description | Rationale | Automation Status |
| --- | --- | --- | --- |
| TC-04 | General feedback | Exercised indirectly by the test helpers, so a separate test adds little | Indirectly exercised |
| TC-09 | Updates | Plain CRUD, covered by the manual run | Not automated |
| TC-12 | Restart persistence | Needs a process restart | Not Suitable |
| TC-14 | Response time | Timings on a laptop or CI runner are unreliable | Not Suitable |
| TC-15 | Backend unavailable | A visual check | Not Suitable |
| TC-16 | Usability | Needs a person | Not Suitable |
| TC-17 | Clean setup | CI building a clean checkout is only partial evidence | Not Suitable |
| TC-18 | Layer separation | A review activity | Not Suitable |

TC-08 (the confirmation dialog) and TC-13 (script text rendering) are partly automated but contain a manual part. All behaviour in the browser stay manual.