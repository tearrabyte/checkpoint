<a id="readme-top"></a>

<!-- PROJECT HEADER -->
<div align="center">

  <!-- SHIELDS -->
  [![React][react-shield]][react-url]
  [![ASP.NET Core][aspnet-shield]][aspnet-url]
  [![C#][csharp-shield]][csharp-url]
  [![SQLite][sqlite-shield]][sqlite-url]

  <br />

  <!-- TODO: ADD HEADING LOGO HERE -->
  
  # Checkpoint
  #### *A structured playtesting and software quality assurance platform for indie game development.*
  A locally hosted prototype designed to help indie developers organise playtesting feedback, manage defects, and improve visibility into software quality.

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

Checkpoint aims to provide a centralised structure for managing this information throughout the playtesting process. The prototype will support the organisation of playtest sessions, structured feedback collection, issue management, and visibility into reported quality concerns.

The project focuses on applying software quality assurance principles to a realistic software development problem, with particular emphasis on requirements quality, defect management, testing, traceability, quality measurement, and responsible AI-assisted development.

<br />


<!-- FEATURES -->
## Features
The following features are planned for the prototype:

* **Project management**  
  Create and manage a game project and its associated information.
  
* **Playtest session management**  
  Create and organise individual playtesting sessions, associating tester feedback with the relevant session and project version.
  
* **Structured feedback collection**  
  Provide a consistent format for testers to report feedback and defects, capturing information such as descriptions, expected behaviour, actual behaviour, reproduction steps, and relevant testing information.

* **Issue management**  
  Review, categorise, prioritise, and track reported issues. Maintain issue status throughout the resolution process.

* **Quality visibility**  
  Provide developers with an overview of reported issues and their current state, supporting identification of recurring or higher-priority quality concerns.
      
* **Software quality assurance**  
The project is developed using software quality assurance practices, including requirements analysis, test planning, defect management, traceability, quality measurement, risk management, and responsible AI-assisted development.

> Feature scope may change as requirements analysis, prototyping, and testing progress throughout development.

<p align="right"><a href="#readme-top">Back to top</a></p>


<!-- GETTING STARTED -->
## Getting Started
Checkpoint is currently intended to run as a locally hosted application for development and demonstration purposes.

<!-- PREREQUISITES -->
#### Prerequisites
- Visual Studio
- .NET SDK
- Node.js and npm
- Git

<!-- INSTALLATION -->
#### Clone Repository
```sh
git clone https://github.com/tearrabyte/checkpoint.git
cd checkpoint
cd backend
dotnet restore
dotnet run
cd frontend
npm install
npm run dev
```
> Setup instructions will be updated as the application architecture and development environment are finalised.

<p align="right"><a href="#readme-top">Back to top</a></p>


<!-- BUILT WITH -->
## Built With
#### Frontend
[![React][react-shield]][react-url]

#### Backend
[![ASP.NET Core][aspnet-shield]][aspnet-url] [![C#][csharp-shield]][csharp-url]

#### Database
[![SQLite][sqlite-shield]][sqlite-url]

#### Development Tools
[![Visual Studio][visualstudio-shield]][visualstudio-url] [![GitHub Copilot][copilot-shield]][copilot-url]

<p align="right"><a href="#readme-top">Back to top</a></p>


<!-- QUALITY ASSURANCE -->
## Quality Assurance
Quality assurance is a central focus of the project.
Development and project activities will include:
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

[aspnet-shield]: https://img.shields.io/badge/ASP.NET_Core-512BD4?style=for-the-badge&logo=dotnet&logoColor=white
[aspnet-url]: https://dotnet.microsoft.com/apps/aspnet

[csharp-shield]: https://img.shields.io/badge/C%23-512BD4?style=for-the-badge&logo=CSHARP&logoColor=white
[csharp-url]: https://dotnet.microsoft.com/languages/csharp

[sqlite-shield]: https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white
[sqlite-url]: https://www.sqlite.org/

[visualstudio-shield]: https://img.shields.io/badge/Visual_Studio-5C2D91?style=for-the-badge
[visualstudio-url]: https://visualstudio.microsoft.com/

[copilot-shield]: https://img.shields.io/badge/GitHub_Copilot-000000?style=for-the-badge&logo=githubcopilot&logoColor=white
[copilot-url]: https://github.com/features/copilot

<!-- PROJECT CREDITS SHIELDS -->
[tearrabyte-shield]: https://img.shields.io/badge/GitHub-tearrabyte-181717?style=for-the-badge&logo=github
[tearrabyte-url]: https://github.com/tearrabyte
