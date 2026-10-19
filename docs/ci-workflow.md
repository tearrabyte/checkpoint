# Continuous Integration Workflow

## CI Workflow
The continuous integration workflow runs each time a commit is pushed to main or a pull request targets main. The purpose is to catch integration and regression issues before changes are merged.
GitHub starts a clean Windows computer, downloads the repository, builds it and runs the tests. If a step fails, the run is marked as red and the step that caused the failure is revealed.

Continuous deployment has not been implemented as the project is being developed and verified locally, with no configured deployment target or release envioment. The current workflow could be extended with a deployment job if a suitable target were introduced.


Checkpoint's CI workflow file is `.github/workflows/ci.yml`. It runs on every push and pull request to main.

| Stage | Where | What Happens |
| --- | --- | --- |
| Develop | Visual Studio and VS Code, locally | Code tests are written and run locally |
| Commit | GitHub Desktop | Small commits with conventional messages |
| Integrate | GitHub Actions | The backend is built and tested, the frontend is built |
| Feedback | Actions tab and README badge | A red run is fixed before further work |

## Quality Gates
| Gate | Pass Condition |
| --- | --- |
| Backend build | Release build succeeds |
| Smoke test | The selected smoke test passes |
| Backend tests | All automated backend tests pass |
| Frontend build | npm run build succeeds |
| Frontend lint | npm run lint exits successfully |
| Code review | Diff reviewed before merging |
| Continuous deployment | Not necessary for this project. |

## Limitations
The selected CI workflow has several limitations.Firstly, as a solo developer, independent peer review is unavailable, meaning that code changes do not benefit from a second developer's persepctive. This is mitigated through self-review of pull-request diffs and mandatory automated CI checks, which help identify potential issues before changes are integrated.

Secondly, the automated API integration tests primarily verify backend behaviour and do not replace broswer-based system testing. User-interface behaviour, accessibility, visual layout, and end-to-end user workflows still require manual verification. Hence, some functional and non-functional requirements may not have automated test coverage.

Additionally, the workflow verifies that the application builds and the automated tests pass, but it does not currently demonstrate deployment to a host environment. Test coverage is also not currently quantified. Automated tests are selected based on risk and their relevance to project requirements.

A successful CI run provides evidence that the build and automated tests have passed, but it does not guarantee that all requirements have been met or that the application is ready for production.