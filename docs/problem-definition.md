# Problem Definition

## Problem Statement
Small indie game studios and solo developers often rely on informal communication channels such as messaging platforms, forms and spreadsheets to manage playtesting feedback. While convenient and accessible, these tools are not inherently designed for software quality assurance, making it difficult for developers to maintain a consistent, meaningful, and comprehensive record of issues identified during playtesting.  

This lack of structure means feedback can become scattered across conversations and documents, resulting in duplicated, disjointed or incomplete bug reports, inconsistent issue descriptions, missing reproduction information, and limited visibility into the current state and severity of reported problems. Furthermore, without a consistent method for categorisation or prioritisation, feedback relating to gameplay, usability, balance or other aspects of quality may be missed or left unattended for too long. As the number of playtesters, sessions and reports grow, these issues become increasingly difficult to manage.

Without structured feedback and defect management, developers may have difficulty identifying recurring quality problems, prioritising work, and monitoring unresolved issues. These challenges can affect the completeness, consistency, traceability, and usability of quality information throughout the development process.

The proposed project, Checkpoint, is a locally hosted software quality assurance and playtesting platform specifically designed for indie game development. The system aims to provide structured playtesting session management, feedback collection, issue management, and quality visibility within a centralised location. The prototype will investigate whether providing a dedicated structure for capturing and managing playtesting information can improve the consistency, organisation, and traceability of software quality feedback within an indie game development context.

## Background and Context
The indie development landscape encompasses a wide variety of development environments, ranging from solo developers working independently to small teams with limited resources or distributed contributors. Playtesting is an important part of this process, as it allows developers to identify defects and evaluate usability, gameplay, balance, accessibility, and overall player experience within their game.

For small development teams, using readily available communication and productivity tools to collect playtesting feedback is practical and low-cost. However, these tools often lack the structured approaches to collection, categorisation, prioritisation and traceability required for effective management of software quality information. As playtesting progresses, developers will need to consolidate information from multiple sources to identify and differentiate between defects, usability and gameplay issues, feature requests, and other concerns. Without a consistent structure for capturing this, the usefulness of individual reports can vary. It may also become difficult to establish a clear overview of outstanding issues and their progress towards resolution.

An opportunity is therefore identified to investigate a dedicated playtesting and quality assurance solution. While not intended to replace the development and communication tools already utilised by indie game developers, Checkpoint is planned to provide a focused structure for capturing and managing playtesting information and transforming tester feedback into actionable quality information.

## Motivation and Practical Relevance
The motivation for Checkpoint is to support software quality assurance within small-scale game development by making quality information more consistent and actionable through a unified system for recording, categorising, prioritising and tracking issues identified during testing. This is of practical relevance to indie developers, who may share development and quality assurance responsibilities and could benefit from a lightweight and accessible, centralised tool for managing playtesting information.

## Stakeholders and Users
| Stakeholder             | Interest / Need                                                                                            |
| ------------------------| ---------------------------------------------------------------------------------------------------------- |
| Indie Developers        | Need a way to organise playtesting feedback and manage identified issues.                                  |
| Game Development Teams  | Require shared visibility of quality issues and their current status.                                      |
| Playtesters             | Need a consistent, structured, and accessible way to report feedback and defects found during playtesting. |
| Studio / Project Leads  | Require visibility into recurring issues, priorities, and overall game quality.                            |

Developers and playtesters will form the primary user base of Checkpoint.

| User         | Purpose                                                                                                                            |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| Developers   | Manage projects and playtest sessions, review and triage submitted feedback, track identified issues, and monitor software quality.|
| Playtesters  | Participate in playtest sessions and submit structured feedback and defect reports based on their testing experience.              |

## Software Quality Issues
| Quality Concern  | Relevance                                                                                                                    |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Completeness     | Feedback may lack important information such as reproduction steps, expected behaviour, actual behaviour, or testing environment.                                                                                                                                      |
| Consistency      | Different testers may describe similar issues in different or unclear ways, making reports difficult to compare and triage.  |
| Traceability     | Feedback may lack a clear connection to a specific playtest session, game version, feature, or defect status.                | 
| Usability        | If the reporting process is lengthy or unclear, testers may provide incomplete information or avoid reporting issues.        |
| Reliability      | Important feedback may be overlooked when scattered across conversations, documents, or other communication channels.        |
| Maintainability  | Without structured issue records or status information, developers may have difficulty maintaining an accurate history of reported and resolved issues.                                                                                                                     |

## Scope and Feasibility
Checkpoint is particularly suitable as a Software Quality Assurance project as it is directly focused on the collection, analysis, and management of software quality information during playtesting. 

The proposed Checkpoint prototype is intended to be achievable within a single semester as an individual project. Initially, the scope focuses on the core workflow of creating a project, organising playtest sessions, collecting structured feedback, managing identified issues, and providing developers with an overview of game quality. The focus is on demonstrating the underlying workflow without attempting to create a production-ready commercial platform.

Features such as advanced authentication, real-time collaboration, external integrations, large-scale analytics, and comprehensive project management functionality are considered outside the initial scope. These features may be regarded as possible future enhancements but will not be required in the prototype. The application is currently planned as a locally hosted system using a React-based frontend, an ASP.NET Core Web API backend implemented in C#, and SQLite for local data storage. 
