const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const user = await prisma.user.create({
            data: {
                email: 'target_dummy@example.com',
                credits: 50,
                plan: 'FREE'
            }
        });
        console.log(`Created target dummy with ID: ${user.id}`);
    } catch (e) {
        console.error('Error creating user:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
