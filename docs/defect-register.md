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
| ID | Title | Descripton | Severity | Priority | Status | Root Cause | Corrective Action | Preventive Measure | Verification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DEF-01 | Enums returned as numbers crashed pages | Found by TC-05 on its first run. Status, category and priority arrived as numbers, so the frontend crashed on status.toLowerCase | Critical | Critical | Fixed | ASP.NET Core serialises enums as numbers by default and the frontend assumed strings | Registered a global string enum converter in the backend (fixed during integration, no separate commit ) | Check enum display whenever a DTO changes |  |
| DEF-02 | Relative API base URL left every page blank | Found by manual integration testing. Pages flashed and went blank because requests reached the frontend server and returned HTML | Critical | Critical | Fixed | A relative path remained from an earlier proxy design after the project moved to direct CORS | Set the full API address in client.ts (fix commit 6b7893c) | Keep the API address in one documented constant and check the Network tab after wiring | |
| DEF-03 | Defect dialog overflowed and could not scroll | Found by manual UI check. The defect form grew taller than the screen and its title was cut off | Major | High | Fixed | The dialog body, a flex child, had no min-height of 0, so tall content overflowed instead of scrolling | Added min-height 0 and a viewport-based max-height to the dialog (fix commit cf3a1f5) | Check every dialog at a small window size | |
| DEF-04 | Failed requests showed nothing to the user | Found by exploratory review. A failed page load or a non-field API error left forms and pages silent | Minor | High | Fixed | Error handling only ran for field-level validation errors, and page loads had no catch | Added a fallback error message to forms and load errors to pages (fix commit 9aa1870) | Use one error pattern for every load and submit | |
| DEF-05 | Session editing was missing from the UI | Found by traceability review. FR-04 was implemented in the API but no screen used it | Minor | High | Fixed | Nothing linked each requirement to a UI path | Added a session edit dialog (commit a550035) | Check the traceability matrix for a UI path for every requirement | |