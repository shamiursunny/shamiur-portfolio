
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function verifyState() {
    console.log('--- DATABASE STATE ---')

    const contacts = await db.contact.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5
    })
    console.log(`\nContacts (${contacts.length} found):`)
    contacts.forEach(c => console.log(`- [${c.id}] ${c.name}: ${c.message.substring(0, 20)}...`))

    const projects = await db.project.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5
    })
    console.log(`\nProjects (${projects.length} found):`)
    projects.forEach(p => console.log(`- [${p.id}] ${p.title}`))

    console.log('\n----------------------')
}

verifyState()
    .catch(e => console.error(e))
    .finally(async () => {
        await db.$disconnect()
    })
