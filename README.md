# Student GitHub Repo overview app
Web application for professors or anyone else that wants to have information about multiple Github repositories in one place. App allows for creation of courses that hold student projects which are linked to a Github repo. Project information page displays commit graph, list of commits and a snapshot of production(if the production URL is provided). Server takes snapshots of production every Monday and Friday at 04:00h. Written in typescript with next.js, graphql, express.

## Dependencies

- Node.js 
- npm 
- PostgreSQL

## Installation

### Prerequisites

- Node.js & npm: https://nodejs.org/en/download/
- PostgreSQL: https://www.postgresql.org/download/
- Clone this repo: `git clone https://github.com/tonijukica/thesis-app.git` 
- GitHub API access token (https://github.com/settings/tokens) with following scopes:
  - user
  - public_repo
  - repo
  - repo_deployment
  - repo:status
  - read:repo_hook
  - read:org
  - read:public_key
  - read:gpg_key
- FIDO2 security key or Windows Hello (pin or fingerprint) set up.
 - Alternatively, use Virtual Authenticators Chrome Extension (https://chrome.google.com/webstore/detail/virtual-authenticators-ta/gafbpmlmeiikmhkhiapjlfjgdioafmja) and add new CTAP2 authenticator.

### Setup

- Run `npm install` in the cloned repo directory.
- Create a database in PostgreSQL.
- Application is configured via environment variables contained in
  `.env`. Use the `.env.example` as a template

## Launch

### Development

- Client & Server: `npm run dev`

### Production
- Set production to `true` in `.env`
- Run `npm run build`
- Finally `npm start`

## File import structure

Projects can be imported in bulk with a `.csv` file. The structure of that file looks like this:
| Name         | GitHubURL                             | Students           | Username             |
|--------------|---------------------------------------|--------------------|----------------------|
| Project Name | https://github.com/tonijukica/project | Student1, Student2 | Username1, Username2 |

Column headers can be customized and set in `.env` file.

Alternatively, legacy format can be used with predefined headers such as:
| Prezime i ime | Projekt ID | GitHub Repo                           | Production link                      |
|---------------|------------|---------------------------------------|--------------------------------------|
| Jukica Toni   | 1          | https://github.com/tonijukica/project | https://production.com/tonijukica    |

If two or more students are working on a project then they have the same Projekt ID.
