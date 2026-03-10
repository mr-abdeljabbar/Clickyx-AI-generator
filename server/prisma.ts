import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

console.log('[Prisma] Client instance created.');

export default prisma;
