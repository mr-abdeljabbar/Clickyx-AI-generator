import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import prisma from '../prisma';
import { generateAccessToken, generateRefreshToken, setRefreshTokenCookie, verifyRefreshToken } from '../utils/jwt';
import { registerSchema, loginSchema } from '../utils/validation';
import { OAuth2Client } from 'google-auth-library';
import { AuthRequest } from '../middleware/authMiddleware';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        credits: 3, // Initial free credits
        isEmailVerified: true, // Auto-verify for now (using the correct DB field name)
      },
    });

    res.status(201).json({ message: 'User created successfully. You have 3 free credits!' });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.issues });
    }
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Internal server error', details: error.message || error.toString() });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    // Store refresh token in DB
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    setRefreshTokenCookie(res, refreshToken);

    res.json({ accessToken, user: { id: user.id, email: user.email, role: user.role, credits: user.credits, plan: user.plan } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.issues });
    }
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res.status(400).json({ message: 'Invalid Google token' });
    }

    let user = await prisma.user.findUnique({ where: { email: payload.email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: payload.email,
          isEmailVerified: true, // Google emails are verified
          credits: 3, // Free credits
          plan: 'FREE',
        },
      });
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    setRefreshTokenCookie(res, refreshToken);

    res.json({ accessToken, user: { id: user.id, email: user.email, role: user.role, credits: user.credits, plan: user.plan } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  try {
    const storedToken = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!storedToken) return res.sendStatus(403);

    // Grace Period: If token was recently revoked (within 60s), allow issuing a new access token
    // but don't rotate the refresh token again to avoid race conditions.
    if (storedToken.revokedAt) {
      const revokedTime = new Date(storedToken.revokedAt).getTime();
      const now = Date.now();
      if (now - revokedTime < 60000) { // 60 second grace period
        const user = await prisma.user.findUnique({ where: { id: storedToken.userId } });
        if (!user) return res.sendStatus(403);
        const accessToken = generateAccessToken(user.id, user.role);
        return res.json({ accessToken });
      }
      return res.sendStatus(403);
    }

    // Verify token
    let decoded: any;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (err) {
      return res.sendStatus(403);
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) return res.sendStatus(403);

    // Rotate token with grace period
    const newAccessToken = generateAccessToken(user.id, user.role);
    const newRefreshToken = generateRefreshToken(user.id);

    // Update old token as revoked instead of deleting
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    // Create new token
    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    // Cleanup very old revoked tokens occasionally (optional, but keep it simple for now)

    setRefreshTokenCookie(res, newRefreshToken);
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    res.sendStatus(403);
  }
};

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  }
  res.clearCookie('refreshToken');
  res.sendStatus(204);
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.sendStatus(401);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, credits: true, plan: true },
    });
    if (!user) return res.sendStatus(404);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};
