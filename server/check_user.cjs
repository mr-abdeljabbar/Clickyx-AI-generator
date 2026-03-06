const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const user = await prisma.user.findUnique({
            where: { email: 'admin@clickyx.com' }
        });
        console.log(user ? `User found: ${JSON.stringify(user, null, 2)}` : 'User not found in database.');
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
