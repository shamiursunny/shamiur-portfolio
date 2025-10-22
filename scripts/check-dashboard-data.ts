import { db } from '../src/lib/db'

async function checkDashboardData() {
  console.log('🔐 Dashboard Access Information')
  console.log('===============================')
  console.log('')
  
  try {
    // Check admin user
    console.log('👤 Admin User Information:')
    const adminUser = await db.user.findUnique({
      where: { email: 'shamiur@engineer.com' }
    })
    
    if (adminUser) {
      console.log('✅ Admin user exists')
      console.log(`📧 Email: ${adminUser.email}`)
      console.log(`👤 Name: ${adminUser.name}`)
      console.log(`🆔 ID: ${adminUser.id}`)
      console.log(`📅 Created: ${adminUser.createdAt.toLocaleString()}`)
    } else {
      console.log('❌ Admin user not found')
    }
    
    console.log('')
    
    // Check contacts
    console.log('📧 Contact Messages:')
    const contacts = await db.contact.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    if (contacts.length > 0) {
      console.log(`✅ Found ${contacts.length} contact messages:`)
      console.log('')
      
      contacts.forEach((contact, index) => {
        console.log(`${index + 1}. 📧 From: ${contact.name} (${contact.email})`)
        console.log(`   📝 Message: ${contact.message}`)
        console.log(`   📅 Date: ${contact.createdAt.toLocaleString()}`)
        console.log(`   🆔 ID: ${contact.id}`)
        console.log('')
      })
    } else {
      console.log('❌ No contact messages found')
    }
    
    console.log('')
    
    // Check projects
    console.log('🚀 Projects:')
    const projects = await db.project.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    if (projects.length > 0) {
      console.log(`✅ Found ${projects.length} projects:`)
      console.log('')
      
      projects.forEach((project, index) => {
        console.log(`${index + 1}. 🚀 ${project.title}`)
        console.log(`   📝 Description: ${project.description}`)
        console.log(`   🔗 Link: ${project.link}`)
        console.log(`   📅 Date: ${project.createdAt.toLocaleString()}`)
        console.log(`   🆔 ID: ${project.id}`)
        console.log('')
      })
    } else {
      console.log('❌ No projects found')
    }
    
    console.log('')
    console.log('🔑 Login Information:')
    console.log('====================')
    console.log('🌐 URL: http://127.0.0.1:3000/auth/signin')
    console.log('📧 Email: shamiur@engineer.com')
    console.log('🔑 Password: Shahid@221286')
    console.log('')
    console.log('📋 Steps to Access Dashboard:')
    console.log('1. Open http://127.0.0.1:3000/auth/signin')
    console.log('2. Select "Password" tab')
    console.log('3. Enter email: shamiur@engineer.com')
    console.log('4. Enter password: Shahid@221286')
    console.log('5. Click "Sign In"')
    console.log('6. You will be redirected to /dashboard')
    console.log('')
    console.log('📊 Once logged in, you can:')
    console.log('- View all contact messages')
    console.log('- Manage projects')
    console.log('- See analytics and statistics')
    console.log('- Delete/edit contacts and projects')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await db.$disconnect()
  }
}

checkDashboardData()