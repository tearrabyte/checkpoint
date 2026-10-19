<a id="readme-top"></a>

<!-- PROJECT HEADER -->
<div align="center">

  <!-- SHIELDS -->
  [![React][react-shield]][react-url]
  [![Vite][vite-shield]][vite-url]
  [![TypeScript][typescript-shield]][typescript-url]
  [![ASP.NET Core][aspnet-shield]][aspnet-url]
  [![C#][csharp-shield]][csharp-url]
  [![SQLite][sqlite-shield]][sqlite-url]
  [![CI][ci-shield]][ci-url]

  <br />

  # Checkpoint
  #### *A structured playtesting and software quality assurance platform for indie game development.*
  A locally hosted prototype designed to help indie developers organise playtesting feedback, manage defects, and monitor software quality.

</div>

<!-- TABLE OF CONTENTS -->
<br />
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#getting-started">Getting Started</a>
    <li><a href="#built-with">Built With</a></li>
    <li><a href="#quality-assurance">Quality Assurance</a></li>
    <li><a href="#credits">Credits</a></li>
  </ol>
</details>


<!-- ABOUT THE PROJECT -->
## About The Project

Checkpoint is a locally hosted software quality assurance and playtesting platform designed for small indie game development teams.

Indie developers and small studios often rely on informal communication channels such as messaging platforms, forms, and spreadsheets to collect and manage playtesting feedback. While these tools are convenient and accessible, they can make it challenging to maintain consistent, complete, and traceable quality information as the number of playtesters, sessions, and reports increases.

Checkpoint aims to provide a centralised structure for managing this information throughout the playtesting process. The implemented prototype supports project and playtest session management, structured feedback collection, issue triage, and dashboard visualisations that provide visibility into reported quality concerns.

The project focuses on applying software quality assurance principles to a realistic software development problem, with particular emphasis on requirements quality, defect management, testing, traceability, quality measurement, and responsible AI-assisted development.

<br />


<!-- FEATURES -->
## Features
The prototype includes the following features:

* **Project management**  
  Create, search, view, edit, and delete game projects.
  
* **Playtest session management**  
  Create, view, edit, and delete playtest sessions associated with a project.
  
* **Structured feedback collection**  
  Submit feedback for playtest sessions, including defect details such as expected behaviour, actual behaviour, and reproduction steps where applicable.

* **Issue management**  
  View, search, filter, categorise, prioritise, and update the status of feedback items.

* **Quality visibility**  
  View dashboard summaries and visualisations of feedback by category, status, and priority, along with a playtest session trend.
      
* **Software quality assurance**  
The project applies software quality assurance practices, including requirements analysis, test planning, defect management, traceability, quality measurement, risk management, and responsible AI-assisted development.

<p align="right"><a href="#readme-top">Back to top</a></p>


<!-- GETTING STARTED -->
## Getting Started
Checkpoint runs locally for development and demonstration purposes. The frontend and backend run as separate applications, so both need to be started.

<!-- PREREQUISITES -->
#### Prerequisites
- Visual Studio
- .NET SDK
- Node.js and npm
- Git

<!-- INSTALLATION -->
#### Clone Repository
Clone the repository and navigate to the project directory:

```sh
git clone https://github.com/tearrabyte/checkpoint.git
cd checkpoint
```
#### Run the Backend
Open a terminal and run:
```sh
cd backend
dotnet restore
dotnet run --project .\Checkpoint.Api
```
Keep this terminal running. The API address will be shown in the terminal output.

#### Run the Frontend
Open a second terminal from the repository root and run:
```sh
cd frontend
npm install
npm run dev
```
Open the local URL printed by Vite in the terminal to use Checkpoint. Keep both the frontend and backend running while using the application.

<p align="right"><a href="#readme-top">Back to top</a></p>


<!-- BUILT WITH -->
## Built With
#### Frontend
[![React][react-shield]][react-url] [![Vite][vite-shield]][vite-url] [![TypeScript][typescript-shield]][typescript-url]

#### Backend
[![ASP.NET Core][aspnet-shield]][aspnet-url] [![C#][csharp-shield]][csharp-url] [![Entity Framework Core][efcore-shield]][efcore-url]

#### Database
[![SQLite][sqlite-shield]][sqlite-url]

#### Runtime & Package Manager
[![Node.js][nodejs-shield]][nodejs-url] [![npm][npm-shield]][npm-url]

#### Development Tools
[![Visual Studio][visualstudio-shield]][visualstudio-url] [![GitHub Copilot][copilot-shield]][copilot-url]

<p align="right"><a href="#readme-top">Back to top</a></p>


<!-- QUALITY ASSURANCE -->
## Quality Assurance
Quality assurance is a central focus of the project. Development and project activities include:
- Requirements quality analysis
- Functional and non-functional requirements
- Acceptance criteria
- Test strategy and test planning
- Test cases
- Requirements traceability
- Defect management
- Quality metrics
- Risk management
- Human review and validation of AI-assisted development

<!-- CREDITS -->
## Credits
*Developed as part of an independent academic software quality assurance assignment.*  

[![@tearrabyte][tearrabyte-shield]][tearrabyte-url]  

<p align="right"><a href="#readme-top">Back to top</a></p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- PROJECT BUILT WITH SHIELDS-->
[react-shield]: https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white
[react-url]: https://react.dev/

[vite-shield]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
[vite-url]: https://vite.dev/

[typescript-shield]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org/

[aspnet-shield]: https://img.shields.io/badge/ASP.NET_Core-512BD4?style=for-the-badge&logo=dotnet&logoColor=white
[aspnet-url]: https://dotnet.microsoft.com/apps/aspnet

[csharp-shield]: https://img.shields.io/badge/C%23-512BD4?style=for-the-badge&logo=CSHARP&logoColor=white
[csharp-url]: https://dotnet.microsoft.com/languages/csharp

[efcore-shield]: https://img.shields.io/badge/Entity_Framework_Core-512BD4?style=for-the-badge&logo=dotnet&logoColor=white
[efcore-url]: https://learn.microsoft.com/en-us/ef/core/

[sqlite-shield]: https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white
[sqlite-url]: https://www.sqlite.org/

[nodejs-shield]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[nodejs-url]: https://nodejs.org/

[npm-shield]: https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white
[npm-url]: https://www.npmjs.com/

[visualstudio-shield]: https://img.shields.io/badge/Visual_Studio-5C2D91?style=for-the-badge
[visualstudio-url]: https://visualstudio.microsoft.com/

[copilot-shield]: https://img.shields.io/badge/GitHub_Copilot-000000?style=for-the-badge&logo=githubcopilot&logoColor=white
[copilot-url]: https://github.com/features/copilot

[ci-shield]: https://img.shields.io/github/actions/workflow/status/tearrabyte/checkpoint/ci.yml?style=for-the-badge&logo=githubactions&logoColor=white&label=CI
[ci-url]: https://github.com/tearrabyte/checkpoint/actions/workflows/ci.yml

<!-- PROJECT CREDITS SHIELDS -->
[tearrabyte-shield]: https://img.shields.io/badge/GitHub-tearrabyte-181717?style=for-the-badge&logo=github
[tearrabyte-url]: https://github.com/tearrabyte
