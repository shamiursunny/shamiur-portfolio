import { db } from '../src/lib/db'
import bcrypt from 'bcryptjs'

async function createAdminUser() {
  try {
    const email = 'shamiur@engineer.com'
    const password = 'Shahid@221286'
    const name = 'Shamiur Rashid Sunny'

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('User already exists. Updating password...')
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12)
      
      // Update the user with password
      await db.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          name: name
        }
      })
      
      console.log('✅ User password updated successfully!')
    } else {
      console.log('Creating new admin user...')
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12)
      
      // Create the user
      await db.user.create({
        data: {
          email,
          password: hashedPassword,
          name
        }
      })
      
      console.log('✅ Admin user created successfully!')
    }

    console.log(`📧 Email: ${email}`)
    console.log(`🔑 Password: ${password}`)
    console.log(`👤 Name: ${name}`)
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
  } finally {
    await db.$disconnect()
  }
}

createAdminUser()