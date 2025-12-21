
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Verifying Settings ---');

    // Upsert the key
    const key = 'DEEPSEEK_API_KEY';
    const value = 'vck_3W1DnohQQ0jcH1WL2cbZ1TpqL2kzqBPnYI8KPdXmG0skMXvNNB2hLRoM';

    await prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value, category: 'AI' }
    });
    console.log(`Upserted ${key}`);

    const settings = await prisma.setting.findMany();
    settings.forEach(s => {
        const maskedValue = s.value.length > 8 ? s.value.substring(0, 4) + '...' + s.value.substring(s.value.length - 4) : '****';
        console.log(`Key: ${s.key}, Value: ${maskedValue}, Category: ${s.category}`);
    });
    console.log('--- End of Settings ---');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
