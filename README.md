# Incubyte Salary Manager

An API-only salary management service built with Node.js, Express, SQLite, and Jest.

This project was implemented as a set of vertical slices so each feature could be driven by tests from the outside in.

## Features

- Employee CRUD
- Salary calculation by employee ID
- Salary metrics by country
- Salary metrics by job title

## Requirements

- Node.js 24+
- npm

## Configuration

The app supports the following environment variables:

- `PORT` - server port, defaults to `3000`
- `DATABASE_PATH` - SQLite file path, defaults to `data/salary-manager.sqlite`

Example:

```bash
PORT=4000 DATABASE_PATH=./data/salary-manager.sqlite npm start
```

If `PORT` is invalid, the app fails fast during startup instead of binding to a broken value.
The server loads `.env` automatically through `dotenv`, so you can also create a local `.env` file with the same variables.

## Setup

Install dependencies:

```bash
npm install
```

The first run will create the SQLite database file automatically if it does not already exist.

## Run

Start the API server:

```bash
npm start
```

The server listens on the default port configured in `src/server.js`.

You can override the runtime configuration through environment variables:

```bash
PORT=4000 DATABASE_PATH=./data/salary-manager.sqlite npm start
```

## Test

Run the test suite:

```bash
npm test
```

Run tests in a single worker if you want deterministic output:

```bash
npm test -- --runInBand
```

The tests are written with Jest and cover:

- repository behavior against SQLite
- service validation and transformation rules
- controller HTTP mapping
- route wiring
- config parsing and validation

## API Overview

Employee endpoints:

- `POST /employees`
- `GET /employees`
- `GET /employees/:id`
- `PUT /employees/:id`
- `DELETE /employees/:id`

Salary calculation endpoint:

- `GET /employees/:id/salary`

Salary metrics endpoints:

- `GET /employees/country/:country`
- `GET /employees/job-title/:jobTitle`

### Employee Resource

Each employee record stores:

- full name
- job title
- country
- salary

The CRUD flow is:

1. controller receives the HTTP request
2. service validates and normalizes the payload
3. repository reads or writes SQLite data
4. controller returns the response with the correct status code

### Salary Calculation

The salary calculation endpoint looks up the employee by ID and returns:

- gross salary
- deductions
- net salary

Deduction rules:

- India: 10%
- United States: 12%
- all other countries: 0%

### Salary Metrics

Salary metrics are computed from employee data already stored in SQLite.

- by country: minimum, maximum, and average salary
- by job title: average salary

## Database

The application uses SQLite for persistence. The database file is created automatically at runtime if it does not exist.

The database layer is intentionally small so the rest of the code can stay focused on domain behavior and HTTP mapping.

## Implementation Details

- I used AI to accelerate the initial setup, including project scaffolding, Jest test case drafting, and a few small utility/service functions.
- I used AI to explore architecture options before implementation, especially around SQLite lifecycle management, controller/service/repository boundaries, and how to structure the code for TDD.
- A singleton database exported directly from `server.js` or a shared module was discussed and rejected because it makes tests harder to control and couples startup behavior too tightly to imports.
- The final implementation uses dependency injection and vertical slices:
  - controllers receive dependencies explicitly
  - services contain validation, normalization, and domain behavior
  - repositories handle SQL only
  - each feature was implemented end to end in red/green commits
- I reviewed and adjusted the AI-generated code after each slice by running the test suite and tightening the design when suggestions were too broad or too coupled.
- Tests are written with Jest and focus on observable behavior rather than internal implementation details.
- The config layer keeps runtime concerns like `PORT` and `DATABASE_PATH` separate from business logic.

## AI Usage

I used AI as a pair-programming aid for:

- initial project setup and file structure
- red test drafting for employee CRUD, salary calculation, and salary metrics
- small pure functions and service helpers
- README drafting and refinement

Prompts were focused on implementation planning, test design, and tradeoff analysis. The main rationale was to move quickly on boilerplate while keeping ownership of the architecture and business rules. I kept the final decisions myself, especially for:

- using ESM instead of CommonJS
- using dependency injection instead of app-level globals
- keeping SQLite access in repositories
- keeping validation and normalization in services
- implementing the application as vertical slices with red/green commits
