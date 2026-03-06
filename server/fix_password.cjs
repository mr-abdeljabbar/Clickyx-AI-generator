const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
    try {
        const hashedPassword = await bcrypt.hash('Admin1234', 10);
        const user = await prisma.user.update({
            where: { email: 'admin@clickyx.com' },
            data: { password: hashedPassword }
        });
        console.log(`Successfully hashed password for ${user.email}`);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
