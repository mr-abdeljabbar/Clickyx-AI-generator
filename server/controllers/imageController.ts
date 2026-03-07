import { Request, Response } from 'express';
import prisma from '../prisma';
import { generateImage, uploadImageToR2, getSignedImageUrl } from '../services/cloudflareService';
import { AuthRequest } from '../middleware/authMiddleware';

export const generate = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { prompt } = req.body;

  if (!userId) return res.sendStatus(401);
  if (!prompt) return res.status(400).json({ message: 'Prompt is required' });

  try {
    // Transaction to check and deduct credits
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error('User not found');
      if (user.credits <= 0) throw new Error('Insufficient credits');

      // Deduct credit
      await tx.user.update({
        where: { id: userId },
        data: { credits: { decrement: 1 } },
      });

      await tx.creditTransaction.create({
        data: {
          userId,
          amount: -1,
          type: 'CREDIT_DEDUCTED', // Updated from 'GENERATION' to match DB enum
          balanceAfter: user.credits - 1, // Added required field balanceAfter
        },
      });

      return user;
    });

    // Generate Image
    const imageBuffer = await generateImage(prompt);

    // Upload to R2
    const key = await uploadImageToR2(imageBuffer, 'image/png');

    // Get Signed URL
    const imageUrl = await getSignedImageUrl(key);

    // Store in DB
    await prisma.generatedImage.create({
      data: {
        userId,
        prompt,
        imageUrl: imageUrl, // Store the signed URL or key? DB schema says String. I'll store the key as mapped in prisma but actually schema says imageUrl.
        r2Key: key, // Added required field r2Key
        creditsUsed: 1,
      },
    });

    res.json({ imageUrl, remainingCredits: result.credits, user: result });

  } catch (error: any) {
    console.error(error);
    if (error.message === 'Insufficient credits') {
      return res.status(403).json({ message: 'Insufficient credits' });
    }
    res.status(500).json({ message: 'Generation failed' });
  }
};

export const getHistory = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.sendStatus(401);

  try {
    const images = await prisma.generatedImage.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // Generate signed URLs for all images
    const imagesWithUrls = await Promise.all(images.map(async (img) => ({
      ...img,
      imageUrl: await getSignedImageUrl(img.r2Key), // Using r2Key to generate signed URL
    })));

    res.json(imagesWithUrls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch history' });
  }
};
