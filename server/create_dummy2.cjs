const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const existing = await prisma.user.findUnique({ where: { email: 'purge_target@clickyx.com' } });
        if (!existing) {
            const user = await prisma.user.create({
                data: {
                    email: 'purge_target@clickyx.com',
                    name: 'Purge Target',
                    password: 'none',
                    credits: 50,
                    plan: 'FREE'
                }
            });
            console.log(`Created purge_target with ID: ${user.id}`);
        } else {
            console.log(`purge_target@clickyx.com already exists.`);
        }

        const count = await prisma.user.count();
        console.log(`Total users in DB: ${count}`);

    } catch (e) {
        console.error('Error creating user:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
