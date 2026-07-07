# Forge Careers Backend

The Forge Careers backend powers the APIs and business logic behind Forge Careers, a platform that helps high school students explore skilled-trades careers through interactive learning experiences.

It supports the client application by delivering structured career content, pathway information, simulation-related data, and application workflows.

## Overview

Forge Careers is designed to make skilled-trades career exploration more practical and engaging for students.

This backend provides the server-side foundation for the Forge Careers client application.

## Responsibilities

* Provide career and pathway data to the client application
* Support simulation-related content and workflows
* Deliver structured API endpoints
* Validate incoming requests and handle errors
* Connect the application to its data sources

## Tech Stack

* Node.js
* Express
* JavaScript
* REST API architecture

> Add your database, ORM, authentication provider, and deployment platform here only after confirming they are used in this repository.

## Local Setup

```bash
git clone https://github.com/Forge-IDSP/Backend.git
cd Backend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file based on `.env.example`.

```text
PORT=3000
CLIENT_URL=http://localhost:3000
```

Never commit API keys, database credentials, or production secrets.

## Client Application

The backend supports the Forge Careers client application:

[Forge Careers Client](https://github.com/Forge-IDSP/client)

## Project Structure

```text
src/
  controllers/    Request handling
  routes/         API endpoints
  services/       Business logic
  middleware/     Validation and error handling
```

> Update this section to match the actual folders in the repository.

## Future Improvements

* API documentation with Swagger or OpenAPI
* Automated tests
* CI/CD workflow
* Improved validation and error handling
* Analytics and reporting endpoints
