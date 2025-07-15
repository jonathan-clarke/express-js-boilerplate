import express, { Request, Response } from 'express';

const router = express.Router();

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
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    message: 'Service is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});


export default router;