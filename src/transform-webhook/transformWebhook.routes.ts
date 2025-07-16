import express, { Request, Response } from 'express';
import { validateBody } from '../middleware/validation';
import { transformWebhookSchema } from './transformWebhook.schemas';
import { tranformWebhook } from './transformWebhook.service';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Webhook:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user
 *         email:
 *           type: string
 *           description: The user's email address
 *         username:
 *           type: string
 *           description: The user's username
 *         first_name:
 *           type: string
 *           description: The user's first name
 *         last_name:
 *           type: string
 *           description: The user's last name
 *         is_active:
 *           type: boolean
 *           description: Whether the user is active
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: When the user was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: When the user was last updated
 *     ForterWebhook:
 *       type: object
 *       required:
 *         - transaction_id
 *         - reason
 *         - currency
 *         - amount
 *       properties:
 *         transaction_id:
 *           type: string
 *           description: The transaction id from the webhook
 *         reason:
 *           type: string
 *           description: The reason for the chargeback
 *         currency:
 *           type: string
 *           description: The currency of the chargeback
 *         amount:
 *           type: number
 *           description: The user's first name
 *     ValidationError:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: Validation failed
 *         details:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *               message:
 *                 type: string
 */

/**
 * @swagger
 * /api/webhook:
 *   post:
 *     summary: Create a new user
 *     tags: [Webhook]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransformWebhook'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForterWebhook'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       409:
 *         description: User already exists
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  validateBody(transformWebhookSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      // zod validation in middleware will make sure the type and webhook are passing type correct data
      const { type, webhook } = req.body;
      console.log('Transforming a webhook of type: ', type);
      const forterWebhook = tranformWebhook(type, webhook);
      res.status(200);
      res.json(forterWebhook);
    } catch (error) {
      console.error('Error transforming webhook:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
