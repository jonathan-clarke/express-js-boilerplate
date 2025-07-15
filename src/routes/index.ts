import express, { Request, Response } from 'express';

const router = express.Router();

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
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Express.js TypeScript API Boilerplate',
    version: '1.0.0',
  });
});

export default router;