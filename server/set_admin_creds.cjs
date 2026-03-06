const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
    try {
        const hashedPassword = await bcrypt.hash('Admin@1994', 10);
        const user = await prisma.user.upsert({
            where: { email: 'admin@clickyx.com' },
            update: {
                password: hashedPassword,
                role: 'ADMIN'
            },
            create: {
                email: 'admin@clickyx.com',
                password: hashedPassword,
                name: 'Admin User',
                role: 'ADMIN',
                credits: 9999,
                plan: 'LIFETIME',
                isEmailVerified: true
            }
        });
        console.log(`Successfully configured ${user.email} as ${user.role} with the requested password.`);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
