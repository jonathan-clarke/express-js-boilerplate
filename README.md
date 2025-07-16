# Express.js TypeScript API Boilerplate

A minimal Express.js API built with TypeScript, featuring a health check endpoint, user crud module, and comprehensive Jest tests using Supertest.

## Features

- **TypeScript**: Full TypeScript support with strict configuration
- **Express.js**: Fast, unopinionated web framework
- **Health Check**: Built-in `/health` endpoint for monitoring
- **Testing**: Jest with Supertest for API endpoint testing
- **Development**: Hot reload with nodemon and ts-node
- **Swagger UI**: Interactive API documentation
- **Zod Validation**: Uses Zod to validate incoming and outgoing JSON
- **sqlite DB**: Connector for sqlite db /data
- **DB migrations**: Includes a db migration mechanism for setting up db schema

## Getting Started

1. **Install Nodejs:**

   NVM is the most flexible way to install and manage nodejs:
   https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating

   Or just install nodejs using your system package manager. This project was built and tested on node version v24.2.0.

   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Development mode:**

   ```bash
   npm run dev
   ```

4. **Swagger UI: Api documentation and manual testing**

   Swagger UI will allow you to interact with the api endpoints and documents their required data and returned data.

   Once the development or prod server is running, go to: http://localhost:3000/api-docs this can be used to test various endpoints as well using the try it out functionality.

5. **Run automated tests:**

   The automated tests leverage supertest so they are creating an instance of the api and making actual http calls to it, providing behaviour tests rather than straight unit tests.

   ```bash
   npm test
   ```

   Please note there are negative tests in here so some errors will be shown in the output, but they are suppose to be there. The success of the test run is based on if the tests and the test suites pass. The errors are left in the output as they can be helpful with debugging any test failures.

## API Endpoints

- `GET /` - API information
- `GET /health` - Health check endpoint
- `POST /users` - User CRUD endpoint.

## Swagger Documentation

Access the interactive Swagger UI on your local once you're running in dev mode at: **http://localhost:3000/api-docs**

The Swagger UI allows you to:

- View all available API endpoints
- See detailed request/response schemas
- Test endpoints directly in the browser
- View example requests and responses

For creating Swagger JSDoc comments, see: https://swagger.io/specification/ and https://github.com/Surnet/swagger-jsdoc
