
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

async function checkAuth() {
    const email = 'shamiur@engineer.com'
    const password = 'Shahid@221286'

    console.log(`Checking user: ${email}`)

    const user = await db.user.findUnique({
        where: { email }
    })

    if (!user) {
        console.log('User NOT found')
        return
    }

    console.log('User found:', user.id)
    console.log('Stored hash:', user.password)

    if (!user.password) {
        console.log('User has no password set')
        return
    }

    const isValid = await bcrypt.compare(password, user.password)
    console.log('Password match:', isValid)
}

checkAuth()
    .catch(e => console.error(e))
    .finally(async () => {
        await db.$disconnect()
    })
