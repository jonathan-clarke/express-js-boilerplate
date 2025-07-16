import request from 'supertest';
import app from '../app';
import {
  ForterChargebackWebhook,
  Providers,
  TransformWebhookInput,
  WebhookTypes,
} from './transformWebhook.schemas';

describe('Transform Webhook Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /transform-webhook', () => {
    const amount = 1000;
    const transactionId = 'ch_1AZtxr2eZvKYlo2CJDX8whov';
    const reason = 'general';
    const currency = 'usd';

    const validStripeChargebackWebhook: TransformWebhookInput = {
      type: WebhookTypes['stripe-chargeback'],
      webhook: {
        id: 'evt_1NG8Du2eZvKYlo2CUI79vXWy',
        object: 'event',
        api_version: '2019-02-19',
        created: 1686089970,
        data: {
          object: {
            id: 'du_1MtJUT2eZvKYlo2CNaw2HvEv',
            object: 'dispute',
            amount,
            balance_transactions: [],
            charge: transactionId,
            created: 1680651737,
            currency,
            evidence: {
              access_activity_log: null,
              billing_address: null,
              cancellation_policy: null,
              cancellation_policy_disclosure: null,
              cancellation_rebuttal: null,
              customer_communication: null,
              customer_email_address: null,
              customer_name: null,
              customer_purchase_ip: null,
              customer_signature: null,
              duplicate_charge_documentation: null,
              duplicate_charge_explanation: null,
              duplicate_charge_id: null,
              product_description: null,
              receipt: null,
              refund_policy: null,
              refund_policy_disclosure: null,
              refund_refusal_explanation: null,
              service_date: null,
              service_documentation: null,
              shipping_address: null,
              shipping_carrier: null,
              shipping_date: null,
              shipping_documentation: null,
              shipping_tracking_number: null,
              uncategorized_file: null,
              uncategorized_text: null,
            },
            evidence_details: {
              due_by: 1682294399,
              has_evidence: false,
              past_due: false,
              submission_count: 0,
            },
            is_charge_refundable: true,
            livemode: false,
            metadata: {},
            payment_intent: null,
            reason,
            status: 'warning_needs_response',
          },
        },
        livemode: false,
        pending_webhooks: 0,
        request: {
          id: null,
          idempotency_key: null,
        },
        type: 'setup_intent.created',
      },
    };

    const forterChargebackWebhookResult: ForterChargebackWebhook = {
      transaction_id: transactionId,
      currency,
      amount,
      reason,
      provider: Providers.stripe,
    };

    it('should transform a stripe chargeback webhook', async () => {
      const response = await request(app)
        .post('/webhook')
        .send(validStripeChargebackWebhook)
        .expect(200);

      expect(response.body).toEqual(forterChargebackWebhookResult);
    });

    it('should return 400 for missing required fields', async () => {
      await request(app)
        .post('/webhook')
        .send({
          type: WebhookTypes['stripe-chargeback'],
          webhook: {},
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.error).toBe('Validation failed');
          expect(res.body.details).toEqual(
            expect.arrayContaining([
              {
                field: 'webhook.id',
                message: 'Invalid input: expected string, received undefined',
              },
            ])
          );
        });
    });
  });
});
