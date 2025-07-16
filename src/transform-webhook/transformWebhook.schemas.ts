import { z } from 'zod';

const stripeChargebackWebhook = z.object({
  id: z.string(),
  object: z.string('event'),
  api_version: z.string(),
  created: z.number(),
  data: z.object({
    object: z.object({
      id: z.string(),
      object: z.string('dispute'),
      amount: z.number(),
      balance_transactions: z.array(z.string()),
      charge: z.string(),
      created: z.number(),
      currency: z.string(),
      evidence: z.unknown(),
      evidence_details: z.unknown(),
      is_charge_refundable: z.boolean(),
      livemode: z.boolean(),
      metadata: z.object(),
      payment_intent: z.null().or(z.string()),
      reason: z.string(),
      status: z.string(),
    }),
  }),
  livemode: z.boolean(),
  pending_webhooks: z.number(),
  request: z.unknown(),
  type: z.string('charge.dispute.created'),
});

export type ChargebackWebhookData = z.infer<typeof stripeChargebackWebhook>;

export enum WebhookTypes {
  'stripe-chargeback' = 'stripe-chargeback',
}

export enum Providers {
  stripe = 'stripe',
}

// You can add more webhook data types using z.or
// onto the end of this z.object
export const transformWebhookSchema = z.object({
  type: z.string(WebhookTypes['stripe-chargeback']),
  payload: stripeChargebackWebhook,
});

export type TransformWebhookInput = z.infer<typeof transformWebhookSchema>;

export const forterChargebackWebhookSchema = z.object({
  transaction_id: z.string(),
  reason: z.string(),
  currency: z.string(),
  amount: z.number(),
  provider: z.string().optional(),
});

export type ForterChargebackWebhook = z.infer<
  typeof forterChargebackWebhookSchema
>;
