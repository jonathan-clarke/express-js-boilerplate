import express, { Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import userRoutes from './routes/users';

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express.js TypeScript API Boilerplate',
      version: '1.0.0',
      description:
        'A simple Express.js API with TypeScript and Swagger documentation',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/app.ts', './src/routes/*.ts'], // Path to the API files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(express.json());

// API routes
app.use('/api/users', userRoutes);

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Verify service availability and get system status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                   description: Service status
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                   description: Health status message
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2023-10-01T12:00:00.000Z
 *                   description: Current timestamp in ISO format
 *                 uptime:
 *                   type: number
 *                   example: 123.456
 *                   description: Process uptime in seconds
 */
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    message: 'Service is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get API information
 *     description: Root endpoint that provides basic information about the API
 *     tags: [Info]
 *     responses:
 *       200:
 *         description: API information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Express.js TypeScript API Boilerplate
 *                   description: API description
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                   description: API version
 */
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Express.js TypeScript API Boilerplate',
    version: '1.0.0',
  });
});

export default app;
