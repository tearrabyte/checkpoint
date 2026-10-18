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
| TC-13 | Project name length boundaries | Boundaries are easily repeatable. Script text rendering needs a browser, so stays manual. | API Integration (Boundaries only) | Implemented | CreateProject_NameLength_IsEnforced |
| DEF-06 | Recategorise feedback to Defect without defect fields | Regression guard for DEF-06 | Unit and API Integration | Implemented | RecategoriseToDefect_WithoutDefectFields_Returns400 |

## Automated Test Results
| Metric | First Run | Final Run
| --- | --- |
| Automated Tests Planned | 16 |  |
| Automated Tests Executed | 16 |  |
| Automated Tests Passed | 15 |  |
| Automated Tests Failed | 1 |  |
| Duration | 4.7 seconds |  |

The first run failed 1 test, exposing DEF-06 (the update validation was never run). After the fix all 17 pass.

The number of automated tests does not match the number of rows in the table above. One case can be covered by several automated tests.

## Benefits

## Limitations

## Maintainability

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