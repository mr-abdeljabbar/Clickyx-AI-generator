const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const user = await prisma.user.findUnique({ where: { email: 'user1@example.com' } });
        if (user) {
            await prisma.user.delete({ where: { id: user.id } });
            console.log(`Successfully purged ${user.email} from DB.`);
        } else {
            console.log(`User user1@example.com not found.`);
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
