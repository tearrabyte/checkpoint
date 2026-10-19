# Defect Register

## Purpose
This document records defects identified during the implementation and testing of Checkpoint.

## Defect Lifecycle
The defect lifecycle is managed through the following statuses: Open, Fixed, and Closed. A defect is marked as Open when it is identified, Fixed when the corrective code change is commited, and Closed when its linked test has been passed on a subsequent run. If verification fails and the defect remains unresolved, it must be addressed before closure. A defect that is deliberately not fixed is marked as Deferred and listed under Remaining Quality Risks in the test document. A previously closed defect may be reopened if the issue reoccurs.

## Defect Register Definitions
### Status
| Level | Description |
| --- | --- |
| Open | Defect is identified and awaiting resolution. |
| Fixed | Defect has been fixed and awaits verification. |
| Closed | Defect is verified and no further action is required. |
| Deferred | Defect is not fixed and is listed under remaining quality risks. |
| Reopened | Defect has reoccurred and is reopened for resolution. |

### Severity
| Level | Description |
| --- | --- |
| Critical | A crash, data loss, or the core workflow is blocked with no workaround. |
| Major | A required feature is unusable or wrong, major functionality broken. |
| Minor | Partial functionality or incorrect behavour, but workaround exists. |
| Trivial | Cosmetic issue, minor inconvenience, or does not affect functionality. |

### Priority
| Level | Description |
| --- | --- |
| Critical | Fix immediately. Blocks meaningful testing or release. |
| High | Fix before release verification. |
| Medium | Fix if time and resources allow. |
| Low | Fix when convenient, may be deferred. |

## Defects
| ID | Title | Descripton | Severity | Priority | Status | Root Cause | Corrective Action | Preventive Measure | Linked Test Case(s) | Verification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DEF-01 | Enums returned as numbers crashed pages | Found by TC-05 on its first run. Status, category and priority arrived as numbers, so the frontend crashed on status.toLowerCase | Critical | Critical | Closed | ASP.NET Core serialises enums as numbers by default and the frontend assumed strings | Registered a global string enum converter in the backend (fixed during integration, no separate commit ) | Check enum display whenever a DTO changes | TC-03, TC-05 | Manual testing of TC-03 and TC-05 both passed, see `docs/test-cases-and-traceability.md`. Automated tests CreateSession_Returns201WithReadableStatus and SubmitDefect_WithAllFields_Returns201 also passed. |
| DEF-02 | Relative API base URL left every page blank | Found by manual integration testing. Pages flashed and went blank because requests reached the frontend server and returned HTML | Critical | Critical | Closed | A relative path remained from an earlier proxy design after the project moved to direct CORS | Set the full API address in client.ts (fix commit 6b7893c) | Keep the API address in one documented constant and check the Network tab after wiring | TC-01 - TC-11 | Manual testing of TC-01 to TC-11 passed, see `docs/test-cases-and-traceability.md`. Partial automated coverage which passed, see `docs/test-automation.md` |
| DEF-03 | Defect dialog overflowed and could not scroll | Found by manual UI check. The defect form grew taller than the screen and its title was cut off | Major | High | Closed | The dialog body, a flex child, had no min-height of 0, so tall content overflowed instead of scrolling | Added min-height 0 and a viewport-based max-height to the dialog (fix commit cf3a1f5) | Check every dialog at a small window size | TC-05, TC-06 | Manual testing of TC-05 and TC-06 passed, see `docs/test-cases-and-traceability.md` . Automated tests SubmitDefect_WithAllFields_Returns201, SubmitDefect_WithoutDefectFields_Returns400ForEachField and FeedbackValidationTests passed. |
| DEF-04 | Failed requests showed nothing to the user | Found by exploratory review. A failed page load or a non-field API error left forms and pages silent | Minor | High | Closed | Error handling only ran for field-level validation errors, and page loads had no catch | Added a fallback error message to forms and load errors to pages (fix commit 9aa1870) | Use one error pattern for every load and submit | TC-15 | Manual testing of TC-15 passed. See `docs/test-cases-and-traceability.md`|
| DEF-05 | Session editing was missing from the UI | Found by traceability review. FR-04 was implemented in the API but no screen used it | Minor | High | Closed | Nothing linked each requirement to a UI path | Added a session edit dialog (commit a550035) | Check the traceability matrix for a UI path for every requirement | TC-09 | Manual testing of TC-09 passed. See `docs/test-cases-and-traceability.md` |
| DEF-06 | Recategorising feedback to Defect bypassed required-field validation | Found by automated API integration testing. Updating existing feedback to category Defect without ExpectedBehaviour, ActualBehaviour, ReproductionSteps and Environment did not return validation errors for all four required fields. | Major | High | Closed | FeedbackUpdateDTO did not validate defect-specific required fields when the category changed to Defect during an update. | Implemented IValidatableObject on FeedbackUpdateDTO to validate the four defect-specific fields during updates. | Test conditional validation on both create and update operations, including recategorisation to Defect with missing fields. | None | Update_RecategorisedToDefect_WithoutDefectFields_ReportsAllFourFields passed after the fix. A new defect guard, RecategoriseToDefect_WithoutDefectFields_Returns400, was also implemented and passed.|
| DEF-07 | Feedback dialog steals keyboard focus during input | Found by TC-04 manual run. When typing into a form field int he feedback submission dialog, keyboard focus unexpectedly moves away from the active input to the close button. This interrupts keyboard-based form entry and reduces usability. The remaining submission functionality works as expected. | Minor | Medium | Closed | The dialog's focus-management effect depended on the onClose callback prop, which was recreated as a new function reference on every parent re-render. Any state update inside the dialog (such as typing in a form field) caused the effect to rerun and refocus the first focusable element in the dialog, which was the close button. | Added an onCloseRef to decouple the keydown handler from the effect's dependency array, and scoped the effect to [open] only. | When wiring a useEffect with a callback prop in its dependency array, check whether that callback is stable in the parent, or use a ref instea especially for effects with side effects like focus or DOM mutation. | TC-04 | TC-04 passed after documentation update, see `docs/test-cases-and-traceability.md`. |
| DEF-08 | Incorrect API startup command in README | The README documents dotnet run, which does not reliably launch the API from the backend folder as the API project is located in the parent directory. | Minor | Medium | Closed | The documented startup command does not explicitly target the API project. | Replaced the documented command with `dotnet run --project .\Checkpoint.Api` | Verify documented setup instructions from a clean clone and ensure commands are executed from the stated working directory. | TC-17 | TC-17 passed after documentation update, see `docs/test-cases-and-traceability.md`. |