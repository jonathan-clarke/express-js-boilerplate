import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

/**
 * Health check endpoint to verify service availability
 * @route GET /health
 * @returns {Object} 200 - Health status object
 * @returns {string} 200.status - Service status (OK)
 * @returns {string} 200.message - Health status message
 * @returns {string} 200.timestamp - Current timestamp in ISO format
 * @returns {number} 200.uptime - Process uptime in seconds
 * @example
 * // Response example:
 * {
 *   "status": "OK",
 *   "message": "Service is healthy",
 *   "timestamp": "2023-10-01T12:00:00.000Z",
 *   "uptime": 123.456
 * }
 */
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    message: 'Service is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * Root endpoint providing API information
 * @route GET /
 * @returns {Object} 200 - API information object
 * @returns {string} 200.message - API description
 * @returns {string} 200.version - API version
 * @example
 * // Response example:
 * {
 *   "message": "Express.js TypeScript API Boilerplate",
 *   "version": "1.0.0"
 * }
 */
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Express.js TypeScript API Boilerplate',
    version: '1.0.0'
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app, server };