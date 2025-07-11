# Express.js TypeScript API Boilerplate

A minimal Express.js API built with TypeScript, featuring a health check endpoint and comprehensive Jest tests using Supertest.

## Features

- **TypeScript**: Full TypeScript support with strict configuration
- **Express.js**: Fast, unopinionated web framework
- **Health Check**: Built-in `/health` endpoint for monitoring
- **Testing**: Jest with Supertest for API endpoint testing
- **Development**: Hot reload with nodemon and ts-node
- **Swagger UI**: Interactive API documentation

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Development mode:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Start production server:**
   ```bash
   npm start
   ```

5. **Run tests:**
   ```bash
   npm test
   ```

## API Endpoints

- `GET /` - API information
- `GET /health` - Health check endpoint

## Swagger Documentation

Access the interactive Swagger UI at: **http://localhost:3000/api-docs**

The Swagger UI allows you to:
- View all available API endpoints
- See detailed request/response schemas  
- Test endpoints directly in the browser
- View example requests and responses

For creating Swagger JSDoc comments, see: https://swagger.io/specification/ and https://github.com/Surnet/swagger-jsdoc

## Project Structure

```
express-js-boilerplate/
├── src/
│   ├── __tests__/
│   │   ├── setup.ts
│   │   └── health.test.ts
│   └── index.ts
├── dist/
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## Testing

The project includes comprehensive tests for the health check endpoint using Jest and Supertest. Tests verify:

- HTTP status codes
- Response body structure
- Content-Type headers
- Data types and values