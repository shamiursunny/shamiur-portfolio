// Script to save GitHub token to the database using Prisma
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const token = process.argv[2];
    if (!token) {
        console.error('Usage: ts-node save-github-token.ts <github_token>');
        process.exit(1);
    }
    try {
        await prisma.setting.upsert({
            where: { key: 'GITHUB_TOKEN' },
            update: { value: token },
            create: { key: 'GITHUB_TOKEN', value: token },
        });
        console.log('GitHub token saved successfully.');
    } catch (error) {
        console.error('Error saving GitHub token:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
