import { Request, Response } from 'express';
import prisma from '../prisma.js';

export const handleWebhook = async (req: Request, res: Response) => {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  // TODO: Verify signature using webhookId and req.headers
  
  const event = req.body;
  const eventType = event.event_type;
  const resource = event.resource;

  try {
    if (eventType === 'BILLING.SUBSCRIPTION.ACTIVATED') {
      const subscriptionId = resource.id;
      const userId = resource.custom_id; // Assuming we pass userId as custom_id
      
      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: { plan: 'PRO', credits: { increment: 50 } }, // Grant initial 50 credits? Or just set plan?
          // User said "50 credits per month".
          // We should probably set a subscription record.
        });
        
        await prisma.subscription.create({
          data: {
            paypalSubId: subscriptionId,
            userId,
            status: 'ACTIVE',
            plan: 'PRO',
          },
        });
      }
    } else if (eventType === 'BILLING.SUBSCRIPTION.CANCELLED' || eventType === 'BILLING.SUBSCRIPTION.EXPIRED') {
      const subscriptionId = resource.id;
      const subscription = await prisma.subscription.findUnique({ where: { paypalSubId: subscriptionId } });
      
      if (subscription) {
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: { status: 'CANCELLED', endDate: new Date() },
        });
        
        await prisma.user.update({
          where: { id: subscription.userId },
          data: { plan: 'FREE' },
        });
      }
    } else if (eventType === 'PAYMENT.SALE.COMPLETED') {
        // Handle one-time payment for Lifetime
        // Check if it's a subscription payment or one-time
        // If resource.billing_agreement_id is present, it's a subscription payment.
        // If not, and amount is $50, it might be Lifetime.
        // We need a way to distinguish.
        // Assuming custom_id contains "LIFETIME_USERID" or similar.
        const customId = resource.custom; // PayPal uses 'custom' for one-time payments
        if (customId && customId.startsWith('LIFETIME_')) {
            const userId = customId.split('_')[1];
            await prisma.user.update({
                where: { id: userId },
                data: { plan: 'LIFETIME', credits: { increment: 150 } },
            });
            await prisma.payment.create({
                data: {
                    paypalOrderId: resource.id,
                    userId,
                    amount: parseFloat(resource.amount.total),
                    currency: resource.amount.currency,
                    status: 'COMPLETED',
                }
            });
        }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook Error:', error);
    res.sendStatus(500);
  }
};
