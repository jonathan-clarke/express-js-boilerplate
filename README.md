# Forter Take Home: Mapping chargeback webhooks

Solution is based on a minimal Express.js API built with TypeScript, featuring a health check endpoint and comprehensive Jest tests using Supertest.

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
- `POST /webhook` - Webhook transform endpoint. Requires that you provide the webhook type as well as the webhook payload in the json.

## Swagger Documentation

Access the interactive Swagger UI on your local once you're running in dev mode at: **http://localhost:3000/api-docs**

The Swagger UI allows you to:

- View all available API endpoints
- See detailed request/response schemas
- Test endpoints directly in the browser
- View example requests and responses

For creating Swagger JSDoc comments, see: https://swagger.io/specification/ and https://github.com/Surnet/swagger-jsdoc

## Design Prompt Answers

### Extensibility

**_How would you design this so we can onboard new providers (Square,
Braintree, etc.) with minimal engineering effort?_**

The project has been designed with onboarding new providers in mind already.

The code under the src/transform-webhook directory contains 4 parts that would need to be updated.

1. In the .schemas.ts file you would need to create a new webhook schema for the webhook body that will be sent as well as adding to the providers enum and the webhook type enum. The new webhook type and schema can then be added under transformWebhookSchema by chaining a .or onto the end of it and adding in the new validation schema for this new type.

2. In the .service.ts file you can add a new webhook transformation function for this new webhook type and add calling it under the switch based on the webhook type enum that was passed in under the general transformWebhook function that gets called by the endpoint

3. In the .route.tx file you would need to add new documentation about the new webhook type that is now supported under the swagger components. I found it useful to use AI to generate the new component in swagger based off the schema that is in the .schema.ts file.

4. In the .test.ts file you can add tests to ensure that your new webhook type works with the endpoint and returns a transformed forter webhook

### Developer Experience

**Developer Experience: If a merchant needed to test their mapping before going live,
what tooling would you expose?**

The project already has Swagger built in, which will allow merchants to be able to view the endpoint and the data types that are supported. They can even use the try it out feature to execute actual calls as well.

We would deploy this all on a publically available test environment so they would be able to test their integrations against it and use swagger to play with the api to understand how it functions as they integrate.

### Safety and Maintainability

**How would you sandbox mapping logic, manage versions, or
detect breaking changes?**

Mapping logic is already contained to the services file at this point. If we are introducing new features or risky changes that could cause breaking changes we would work on isolating them using feature flags, for example with launch darkly, so we can make sure that these new code paths aren't introduced into production until we are sure they work fine.

Managing versions on the api can be done by uri versioning (ie. /v1/webhook, '/v2/webhook') or providing specific versions via headers and using those versions when we accept the api calls to apply the different versions of our validation and logic against them.

Finally, if there is a new version being released we can use the combination of feature flags and public test environment to ensure customers are able to test integrating against the new version and enable the new version only for specific customers.

### GTM Integration

**How could this system help shorten merchant onboarding time? What
key metrics would you track?**

The hope here is that no matter what payment provider the customer is integrating against, they will only need to build their system against our webhook data. There won't need to be work done on their side to transform any of the entities of different providers to be able to be able to pass the webhook data through to our system, removing some of the logic they may need to create when integrating against us.

In terms of measuring metrics, I've included some log lines when there are successful transformations done. We would want to start recording the usage of the endpoint, what webhook types are being used most, as well as any validation errors where unexpected data is being sent against the endpoint. There could be additional laters of observability added to this solution to generate that data for analysis. We could also start to save this data to the DB so we can better analyze the usage of the endpoint, who is using it, and when rather then relying on the possibly unstructured nature of logs.

### Future enhancements

The assumption with these is that we will be continuing to add more webhook event types as we go, these endhancements are more about the core functionality that new webhook types.

1. Building out an MVP to collect the usage data for the endpoint would be the next milestone so we could measure the success of it, and also measuring it against how that particular customer is able to start using other endpoints in our system and get to full integration. This probably would just require log analysis.

2. Improve the workflow to add new webhook types for transformation. Adding the swagger docs via JSDoc is a good way of starting out but it can get pretty painful the more you extend the endpoint with new variations of the supported webhook events. We would leverage something like [Zod to OpenAPI](https://github.com/asteasolutions/zod-to-openapi) to be able to automatically add those components into the swagger documentation based on how we build out the validation schemas.

3. Automated webhook type detection. The project was built out to be as simple as possible to launch to start, but it may be more helpful for our customers if they could just send us any webhook at all instead of having to provide a type. This would need to have some investigation done to understand how stable the data structures are on the apis and understanding from customers if having to pass the explicit type that is being transformed is a hinderance or not.

4. Better analytics and data capturing to gain further insights on usage of the endpoint, especially if we can avoid having to parse logs to get the data.
