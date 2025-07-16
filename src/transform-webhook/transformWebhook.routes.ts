import express, { Request, Response } from 'express';
import { validateBody } from '../middleware/validation';
import { transformWebhookSchema } from './transformWebhook.schemas';
import { transformWebhook } from './transformWebhook.service';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     WebhookData:
 *       type: object
 *       required:
 *         - type
 *         - payload
 *       properties:
 *         type:
 *           type: string
 *           enum: [stripe-chargeback]
 *           description: The type of webhook that is being transformed
 *         payload:
 *           $ref: '#/components/schemas/StripeChargebackWebhook'
 *     StripeChargebackWebhook:
 *       type: object
 *       required:
 *         - id
 *         - object
 *         - api_version
 *         - created
 *         - data
 *         - livemode
 *         - pending_webhooks
 *         - request
 *         - type
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the event
 *         object:
 *           type: string
 *           enum: [event]
 *           description: String representing the object's type
 *         api_version:
 *           type: string
 *           description: The Stripe API version used to render data
 *         created:
 *           type: number
 *           description: Time at which the object was created (Unix timestamp)
 *         data:
 *           type: object
 *           required:
 *             - object
 *           properties:
 *             object:
 *               type: object
 *               required:
 *                 - id
 *                 - object
 *                 - amount
 *                 - balance_transactions
 *                 - charge
 *                 - created
 *                 - currency
 *                 - evidence
 *                 - evidence_details
 *                 - is_charge_refundable
 *                 - livemode
 *                 - metadata
 *                 - payment_intent
 *                 - reason
 *                 - status
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Unique identifier for the dispute
 *                 object:
 *                   type: string
 *                   enum: [dispute]
 *                   description: String representing the object's type
 *                 amount:
 *                   type: number
 *                   description: Disputed amount in cents
 *                 balance_transactions:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of zero, one, or two balance transactions
 *                 charge:
 *                   type: string
 *                   description: ID of the charge that was disputed
 *                 created:
 *                   type: number
 *                   description: Time at which the object was created (Unix timestamp)
 *                 currency:
 *                   type: string
 *                   description: Three-letter ISO currency code
 *                 evidence:
 *                   description: Evidence provided to respond to a dispute
 *                 evidence_details:
 *                   description: Details about the evidence submission
 *                 is_charge_refundable:
 *                   type: boolean
 *                   description: If true, it is still possible to refund the disputed payment
 *                 livemode:
 *                   type: boolean
 *                   description: Has the value true if the object exists in live mode
 *                 metadata:
 *                   type: object
 *                   description: Set of key-value pairs attached to the object
 *                 payment_intent:
 *                   type: string
 *                   nullable: true
 *                   description: ID of the PaymentIntent that was disputed
 *                 reason:
 *                   type: string
 *                   description: Reason given by the cardholder for the dispute
 *                 status:
 *                   type: string
 *                   description: Current status of the dispute
 *         livemode:
 *           type: boolean
 *           description: Has the value true if the object exists in live mode
 *         pending_webhooks:
 *           type: number
 *           description: Number of webhooks that have yet to be successfully delivered
 *         request:
 *           description: Information on the API request that instigated the event
 *         type:
 *           type: string
 *           enum: [charge.dispute.created]
 *           description: Description of the event
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
 *           description: The amount of the chargeback
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
 * /webhook:
 *   post:
 *     summary: Create a new user
 *     tags: [Webhook]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WebhookData'
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
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  validateBody(transformWebhookSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      // zod validation in middleware will make sure the type and webhook are passing type correct data
      const { type, payload } = req.body;
      console.log('Transforming a webhook of type: ', type);
      const forterWebhook = transformWebhook(type, payload);
      res.status(200);
      res.json(forterWebhook);
    } catch (error) {
      console.error('Error transforming webhook:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
