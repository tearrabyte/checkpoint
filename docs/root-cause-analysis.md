# Root Cause Analysis

The 5 Whys are used as an analysis method within this document. 5 Whys are not a requirement, and the root cause may be uncovered earlier.

## DEF-01: Enums returned as numbers crashed pages
### Facts
- Found by TC-05 on its first run.
- Symptom: the page went blank with the error status.toLowerCase is not a function.
- Impact: the core workflow was unusable until it was fixed.
- Fix commit: Fixed during integration, no separate commit.

### 5 Whys
1. **Why did the page crash?** The frontend called status.toLowerCase(), but status was a number, so the method did not exist on that value.
2. **Why was status a number rather than a string?** ASP.NET Core serialises enums as numeric values by default unless string-enum serialisation is configured.
3. **Why was the default not overridden?** The API's JSON configuration did not include a JsonStringEnumConverter, and no corresponding configuration had been added when the DTOs and enum fields were implemented.
4. **Why did the frontend assume the value was a string?** The frontend types and rendering logic were written around the expected string representation without checking the actual API response against that assumption.
5. **Why wasn't this caught before user-facing testing?** There was no consistent integration checkpoint requiring the frontend and backend to be run together and their actual request and response data verified before further UI testing.

**Root cause category:** Integration
**Contributing category:** Process

**Corrective action:** Added JsonStringEnumConverter to the backend JSON serialisation configuration so enums are returned as strings.

**Preventive measures:**
- Added an automated regression test for readable enum output.
- Include actual API response formats in integration testing, particularly when frontend and backend types must agree.

**What changed in quality or process because of it:**
- The enum serialisation mismatch was fixed centrally rather than through individual frontend workarounds.
- Automated testing now checks an API contract that had previously been assumed rather than verified.

## DEF-02: Relative API base URL left every page blank
### Facts
- Found by manual integration testing.
- Symptom: pages flashed and then went white with the error Cannot read properties of undefined (reading length).
- Impact: every page that loads data was unusable.
- Fix commit: 6b7893c

### 5 Whys
1. **Why did the pages appear blank?** API requests were sent to the frontend development server instead of the backend, so the application did not receive the expected API data.
2. **Why did requests go to the wrong place but still return HTTP 200?** The development server could serve its frontend fallback page for an unrecognised path. The browser received HTML successfully, but the frontend expected API data.
3. **Why was the API URL relative?** The URL was left over from an earlier proxy-based design that was no longer being used.
4. **Why wasn't the old assumption removed everywhere?** The architecture change was made without a complete check of the files and configuration that depended on the previous proxy arrangement.
5. **Why was that dependency check missed?** There was no consistent architecture-change checklist or repository-wide dependency review to prompt checking related URLs and configuration after a design change.

**Root cause category:** Process

**Corrective action:** Updated the API client configuration to use the correct backend API address.

**Preventive measures:**
- When changing architecture or request routing, search for references to the old configuration and verify the affected frontend and backend interactions.
- Include a basic API connectivity check in the local verification workflow.

**What changed in quality or process because of it:**
- The incorrect API destination was corrected.
- The incident identified the need to check downstream dependencies when an architectural decision changes, rather than verifying only the file directly modified.

## DEF-03: Defect dialog overflowed and could not scroll
### Facts
- Found by a manual UI check.
- Symptom: the defect form grew taller than the screen and its title was cut off.
- Impact: the defect report could not be completed comfortably on a small screen.
- Fix commit: cf3a1f5

### 5 Whys
1. **Why did the dialog overflow instead of scrolling?** The dialog content exceeded the available viewport height, but the dialog body could not shrink enough to contain the overflow.
2. **Why didn't overflow-y: auto alone solve the problem?** In a flex layout, a flex child can have a default minimum size based on its content. Setting min-height: 0 allows the child to shrink within the available space and lets its overflow behaviour work as intended.
3. **Why was that property missing?** The dialog layout had not adequately accounted for long content within a constrained viewport. 
4. **Why wasn't the issue caught earlier?** here was no consistent check for the longest realistic form content and smaller viewport sizes when verifying dialogs.

**Root cause category:** Design
**Contributing category:** Process

**Corrective action:**
- Constrained the dialog height and corrected the flex sizing, including min-height: 0 on the scrolling body.
- Allowed the backdrop to scroll where necessary and adjusted narrow-screen spacing.

**Preventive measures:**
- Test dialogs with long forms and realistic content at smaller viewport sizes.
- Check that the dialog header and footer remain usable while the body scrolls.

**What changed in quality or process because of it:**
- Long forms can scroll within the dialog instead of extending beyond the usable viewport.
- Responsive testing now has a specific scenario to check: long content at a constrained viewport size.

## DEF-06: Feedback update skipped defect-field validation
### Facts
- Found by an automated test, not by any manual test (the UI has no category control).
- Symptom: an update that recategorised feedback to Defect without the four defect fields was accepted.
- Impact: FR-06 could be bypassed through the API.
- Fix commit: 7519397

### 5 Whys
1. **Why could feedback be recategorised as a defect without all four required defect fields?** The API accepted an update that changed the feedback category to Defect without enforcing the FR-06 validation rules.
2. **Why weren't the validation rules enforced during the update?** FeedbackUpdateDto declared a Validate method but did not implement IValidatableObject, so ASP.NET Core did not invoke that method as part of model validation.
3. **Why was the missing interface not detected earlier?** The validation method existed in the DTO, but its presence did not guarantee that the framework would execute it. The update-validation behaviour had not been adequately verified.
4. **Why wasn't this gap detected by existing tests?** The existing tests did not adequately cover the specific scenario of recategorising existing feedback to Defect while omitting the required defect fields.
5. **Why was that scenario missing from the test coverage?** The test process did not yet include a specific regression check for conditional validation during feedback updates, leaving a gap between the creation and update workflows.

**Root cause category:** Implementation
**Contributing category:** Testing/ Process

**Corrective action:**
- Implemented IValidatableObject on FeedbackUpdateDto so ASP.NET Core executes the validation rules during updates.
- Added an API-level regression test, RecategoriseToDefect_WithoutDefectFields_Returns400, to verify that the endpoint rejects an invalid update.

**Preventive measures:**
- Add tests for conditional validation on both creation and update paths.
- Include API-level regression tests for important business rules, not only unit tests of validation logic.
- Verify that invalid updates return the expected HTTP status and validation errors.

**What changed in quality or process because of it:**
- Feedback updates now enforce the FR-06 defect-field requirements.
- Automated validation tests check the DTO rules, while the API regression test checks that the rules are enforced through the actual endpoint.
- The missing update-validation scenario is now covered by a repeatable regression check, reducing the risk of the same defect returning in future changes.

## Defects and the checks that now guard them
| Defect | Guarded by | Type |
|---|---|---|
| DEF-01 | ApiTests: CreateSession_Returns201WithReadableStatus, TC-05 | Automated (CI) and manual |
| DEF-02 | README states the API address, TC-17 | Documentation and manual |
| DEF-03 | Manual check of dialogs at a small window size | Manual only |
| DEF-04 | TC-15 | Manual only |
| DEF-05 | Traceability matrix review, TC-09 | Process and manual |
| DEF-06 | FeedbackValidationTests update test, ApiTests: RecategoriseToDefect_WithoutDefectFields_Returns400 | Automated (CI) |