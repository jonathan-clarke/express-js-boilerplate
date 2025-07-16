import {
  ChargebackWebhookData,
  ForterChargebackWebhook,
  Providers,
  WebhookTypes,
} from './transformWebhook.schemas';

export const transformWebhook = (
  type: WebhookTypes,
  webhook: ChargebackWebhookData
): ForterChargebackWebhook => {
  switch (type) {
    case WebhookTypes['stripe-chargeback']:
      return transformStripeChargebackWebhook(webhook);
    default:
      console.log('Attempted transforming unsuported webhook type', type);
      throw new Error('Webhook type not supported');
  }
};

const transformStripeChargebackWebhook = (
  webhook: ChargebackWebhookData
): ForterChargebackWebhook => {
  return {
    transaction_id: webhook.data.object.charge,
    reason: webhook.data.object.reason,
    currency: webhook.data.object.currency,
    amount: webhook.data.object.amount,
    provider: Providers.stripe,
  };
};
