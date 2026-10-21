# Quality Testing

## Purpose
This document outlines the quality-focused testing performed on Checkpoint, including the reasons for selecting each quality area, the testing approach employed, evidence, results, limitations and recommended improvements.

## Quality Areas
Five quality areas were selected based on the risks identified in the problem statement: Security, Performance, Usability, Reliability and Maintainability. A sixth area, Compatibility, is acknowledged but not formally tested beyon the single supported environment (see Limitations). Evidence for each area is drawn from test cases already executed, rather than from separate testing activity, since test cases were designed with these quality areas in mind.

## Quality Testing Plan and Results
| Quality Area | Risk / Reason for Testing | Testing Approach | Evidence | Result | Limitations |
| --- | --- | --- | --- | --- | --- |
| Security | Unvalidated or malicious input could corrupt data or affect application behaviour (NFR-07) | Boundary length testing, script-tag input, SQL-like input, submitted through the UI and checked via DevTools Network | TC-02, TC-06, TC-13 | Pass — all invalid input rejected or safely rendered as literal text. No script execution, no database error | Covers input handling only. No authentication, authorisation or penetration testing (out of scope per project brief) |
| Performance | Slow operations would make the tool unusable for its intended workflow (NFR-01) | Measured API response times via DevTools Network across 7 core operations, 3 runs each, plus a cold start | TC-14 | Pass — all readings under 2000ms (max 141ms) | Measured on one local machine with a small dataset (5-10 feedback items). Not representative of larger datasets |
| Usability | Playtesters and developers must be able to use the tool without training (NFR-05) | Task-based observation of a first-time user completing three core workflow tasks unaided | TC-16 | Pass — all three tasks completed without assistance | Single participant. Not demographically diverse, no comparative baseline |
| Reliability | Data must persist correctly and the system must fail predictably rather than silently (NFR-02) | Restart-and-compare test. Simulated backend outage during active use | TC-12, TC-15 | Pass — data identical after restart, errors surfaced clearly to the user rather than blank pages or silent failures | Only one restart scenario tested. Does not cover partial outages |
| Maintainability | Frontend, backend and data layers must remain separable for future development (NFR-04) | Source code inspection: searched for `fetch(` and direct database access outside their intended layers. Confirmed controllers return DTOs, not entities | TC-18 | Pass — no layer violations found | A static inspection at one point in time. Does not guarantee the boundary is enforced automatically against future changes |
| Compatibility (not formally tested) | The application targets a specific browser/OS combination (NFR-03) | All testing was conducted in Google Chrome on Windows, per NFR-03's defined scope | All test cases | Not independently tested outside the defined environment | No verification on Firefox, Edge, Safari, macOS or Linux. No accessibility/assistive technology testing |

## Results
All five formally tested quality areas passed within their tested scope. No defects specific to a quality area remain open. DEF-01, DEF-03, DEF-04, DEF-05 and DEF-07, each corresponding to reliability or usability, were found and closed during the course of testing. See `docs/defect-register.md`.

## Recommended Improvements

| Quality Area | Recommended Improvement | Rationale |
| --- | --- | --- |
| Security | Add explicit server-side input sanitisation in addition to existing output encoding and parameterised queries | In-depth defence. Current protection relies on the database layer and React's default escaping |
| Performance | Repeat response-time testing with a larger dataset on a different machine | Current results may not hold once the dataset grows |
| Usability | Test with a larger and more varied group of participants | A single participant cannot represent the range of first-time users |
| Reliability | Add tests for partial/interrupted outages | Current testing covers a clean stop/restart only |
| Maintainability | Add an automated check (e.g. a lint rule or architecture test) that enforces the frontend/backend/data-layer boundary | Prevents the boundary found correct by inspection from eroding as the codebase grows |
| Compatibility | Test on at least one additional browser (Firefox or Edge) and consider basic accessibility checks | NFR-03 only requires Chrome/Windows, but wider compatibility reduces risk as Checkpoint may be used on other browsers as well. |
| Accessibility | Conduct basic keyboard-navigation and colour-contrast checks, followed by screen-reader testing where feasible. | Identifies potential barriers that may prevent users with different accessibility needs from completing core workflows. |