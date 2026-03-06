import { Request, Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        subscriptions: true,
        payments: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    // Check if user exists and prevent self-deletion
    if (req.user?.userId === id) {
      return res.status(400).json({ message: 'Administrators cannot delete their own account.' });
    }

    await prisma.user.delete({
      where: { id },
    });

    // Prisma cascading will wipe related tables
    res.json({ message: 'Entity successfully purged from system' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to purge entity' });
  }
};


export const adjustCredits = async (req: AuthRequest, res: Response) => {
  const { userId, amount } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { credits: { increment: amount } },
    });
    await prisma.creditTransaction.create({
      data: {
        userId,
        amount,
        type: 'MANUAL_ADJUSTMENT', // Updated to match DB enum TransactionType
        balanceAfter: user.credits,
      },
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to adjust credits' });
  }
};

export const updateUserPlan = async (req: AuthRequest, res: Response) => {
  const { userId, plan } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { plan },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update plan' });
  }
};

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalImages = await prisma.generatedImage.count();
    const totalPayments = await prisma.payment.aggregate({
      _sum: { amount: true },
    });
    res.json({ totalUsers, totalImages, totalRevenue: Number(totalPayments._sum.amount) || 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};
