import prisma from './server/prisma';

async function main() {
    const user = await prisma.user.findUnique({
        where: { email: 'verified_user@example.com' },
    });
    console.log('User Found:', JSON.stringify(user, null, 2));
    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
