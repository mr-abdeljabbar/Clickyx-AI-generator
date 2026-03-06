const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        await prisma.user.updateMany({
            where: { email: 'testagent2@example.com' },
            data: { role: 'ADMIN' }
        });
        console.log('Successfully elevated user to ADMIN');
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
