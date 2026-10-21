# Quality Metrics

## Purpose
This document records quantitative measures used to evaluate the quality and release readiness of Checkpoint.

## Test Execution Metrics
| Metric | Result |
| --- | --- |
| Planned Test Cases | 18 |
| Executed Test Cases | 18 |
| Passed Test Cases | 18 |
| Failed Test Cases | 0 |
| Blocked Test Cases | 0 |
| Not Run Test Cases | 0 |
| Test Pass Rate | 100% (18/18) |

Two test cases (TC-04, TC-17) failed on their first run, each exposing a defect (DEF-07, DEF-08), and passed on retest. These counts reflect the final run. See Failed Test Investigation in `docs/test-cases-and-traceability.md` for the first-run detail.

## Requirements Coverage
| Metric | Result |
| --- | --- |
| Total Requirements | 20 (13 Functional, 7 Non-Functional) |
| Covered Requirements | 20 |
| Uncovered Requirements | 0 |
| Requirements Coverage Rate | 100% |

Coverage means every requirement maps to at least one test case in the Requirements Traceability Matrix. It does not mean every requirement is automated, see Test Automation below.

## Test Automation
| Metric | Result |
| --- | --- |
| Total Test Cases | 35 |
| Automated Test Cases | 17 |
| Manual Test Cases | 18 |
| Automation Coverage Rate (by test case) | 61% (11/18) |

Automation coverage is reported by test case, not by individual automated test, since several automated tests correspond to one manual test case (e.g. TC-13's boundaries) and some automated tests (the DEF-06 guard) have no manual test case at all.

## Defect Metrics
| Metric | Result |
| --- | --- |
| Total Defects | 9 |
| Open Defects | 0 |
| Closed Defects | 9 |
| Critical Defects | 2 (DEF-01, DEF-02) |
| Major Defects | 2 (DEF-03, DEF-06) |
| Minor Defects | 5 (DEF-04, DEF-05, DEF-07, DEF-08, DEF-09) |
| Trivial Defects | 0 |

## Requirements and Quality Evaluation
| Area | Evaluation | Evidence |
| --- | --- | --- |
| Functional Requirements | 12/13 implemented and verified, 1 (FR-11) partially implemented | `docs/test-cases-and-traceability.md` RTM |
| Non-Functional Requirements | 7/7 verified, within the limits stated in each test case | `docs/test-cases-and-traceability.md` RTM and `docs/quality-testing.md` |
| Acceptance Criteria | 20/20 (AC-16 covered indirectly) | `docs/test-cases-and-traceability.md` |
| Quality Attributes | Security, performance, usability, reliability and maintainability each tested and passed within stated scope. Compatibility not formally tested beyond Chrome/Windows. Accessibility not formally tested. | `docs/quality-testing.md` |

## Testing and Defect Summary
### Testing Results
18 of 18 planned test cases were executed and passed on the final run (100% pass rate), addressing all 20 requirements. Three defects were found and fixed during the testing phase (DEF-06 to DEF-08). Four others were found and fixed earlier in development DEF-01 to DEF - 05). one was found during CI and was fixed and verified immediately after (DEF-09).

## Defect Status
All 9 recorded defects are Closed. None are Open, Fixed but unverified, or Deferred.

## Limitations
See `docs/quality-testing.md` (Limitations) and `docs/test-cases-and-traceability.md` (Remaining Quality Risks) for the full list. The most significant limitation for a release decision is that no automated regression suite covers the React UI, performance was measured on only one machine with a small dataset, usability rests on one participant, and that the application has no authentication.

## Residual Risks
The following risks remain accepted rather than resolved (full detail and mitigations in `docs/test-cases-and-traceability.md`):
- Hardcoded API address in the frontend.
- No session filter in the UI (FR-11 partially implemented).
- Input sanitisation relies on output encoding and parameterised queries rather than server-side stripping.
- No cross-browser or accessibility testing.

## Release Assessment

### Release Decision
Checkpoint is assessed as conditionally ready for release as a prototype deliverable, within the stated scope, with the residual risks above formally documented and accepted rather than hidden.

### Evidence
| Exit Criterion (from `docs/test-strategy.md`) | Status | Evidence |
| --- | --- | --- |
| At least 15 of 18 tests executed | Met | 18/18 executed (Test Execution Summary) |
| Every test covering FR-01–09, FR-13 passes | Met | RTM and final test results |
| At least 90% of executed tests pass | Met | 100% pass rate (Test Execution Summary) |
| No open Critical or High severity defects | Met | 0 Open defects (Defect Register) |
| Every failed test has a defect ID, corrective action and retest | Met | DEF-07, DEF-08 (Failed Test Investigation) |
| Every requirement maps to a test or justification | Met | 20/20 requirements covered (RTM) |
| Every NFR-01 measurement ≤ 2 seconds | Met | Max 141ms (TC-14) |