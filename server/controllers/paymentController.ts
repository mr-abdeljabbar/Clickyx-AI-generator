import { Request, Response } from 'express';
import prisma from '../prisma';

export const handleWebhook = async (req: Request, res: Response) => {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  // TODO: Verify signature using webhookId and req.headers

  const event = req.body;
  const eventType = event.event_type;
  const resource = event.resource;

  try {
    if (eventType === 'BILLING.SUBSCRIPTION.ACTIVATED') {
      const subscriptionId = resource.id;
      const customId = resource.custom_id; // Using custom_id from PayPal subscription

      if (customId) {
        await prisma.user.update({
          where: { id: customId },
          data: {
            plan: 'PRO',
            credits: { increment: 50 },
            isEmailVerified: true, // Assuming payment verifies email
          },
        });

        await prisma.subscription.create({
          data: {
            paypalSubscriptionId: subscriptionId,
            userId: customId,
            status: 'ACTIVE',
            plan: 'PRO',
          },
        });

        await prisma.creditTransaction.create({
          data: {
            userId: customId,
            amount: 50,
            type: 'CREDIT_ADDED',
            description: 'Monthly PRO subscription credits',
            balanceAfter: (await prisma.user.findUnique({ where: { id: customId } }))?.credits || 50,
          },
        });
      }
    } else if (eventType === 'BILLING.SUBSCRIPTION.CANCELLED' || eventType === 'BILLING.SUBSCRIPTION.EXPIRED') {
      const subscriptionId = resource.id;
      const subscription = await prisma.subscription.findUnique({ where: { paypalSubscriptionId: subscriptionId } });

      if (subscription) {
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: { status: 'CANCELLED', cancelledAt: new Date() },
        });

        await prisma.user.update({
          where: { id: subscription.userId },
          data: { plan: 'FREE' },
        });
      }
    } else if (eventType === 'PAYMENT.SALE.COMPLETED') {
      const customId = resource.custom;
      if (customId && customId.startsWith('LIFETIME_')) {
        const userId = customId.split('_')[1];
        await prisma.user.update({
          where: { id: userId },
          data: { plan: 'LIFETIME', credits: { increment: 150 } },
        });
        await prisma.payment.create({
          data: {
            paypalPaymentId: resource.id,
            userId,
            amount: parseFloat(resource.amount.total),
            currency: resource.amount.currency,
            plan: 'LIFETIME',
            status: 'COMPLETED',
          }
        });

        await prisma.creditTransaction.create({
          data: {
            userId,
            amount: 150,
            type: 'CREDIT_ADDED',
            description: 'Lifetime purchase credits',
            balanceAfter: (await prisma.user.findUnique({ where: { id: userId } }))?.credits || 150,
          },
        });
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook Error:', error);
    res.sendStatus(500);
  }
};
