# Express.js TypeScript API Boilerplate

A minimal Express.js API built with TypeScript, featuring a health check endpoint and comprehensive Jest tests using Supertest.

## Features

- **TypeScript**: Full TypeScript support with strict configuration
- **Express.js**: Fast, unopinionated web framework
- **Health Check**: Built-in `/health` endpoint for monitoring
- **Testing**: Jest with Supertest for API endpoint testing
- **Development**: Hot reload with nodemon and ts-node

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