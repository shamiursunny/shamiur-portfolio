import { db } from '../src/lib/db'

async function showMessagesDirectly() {
  console.log('📧 Direct Messages Access')
  console.log('========================')
  console.log('')
  
  try {
    // Get all contacts
    const contacts = await db.contact.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    console.log(`📊 Found ${contacts.length} contact messages:`)
    console.log('')
    
    contacts.forEach((contact, index) => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log(`${index + 1}. 📧 From: ${contact.name}`)
      console.log(`   📧 Email: ${contact.email}`)
      console.log(`   📝 Message: ${contact.message}`)
      console.log(`   📅 Date: ${contact.createdAt.toLocaleString()}`)
      console.log(`   🆔 ID: ${contact.id}`)
      console.log('')
    })
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    console.log('🔑 Login Information:')
    console.log('====================')
    console.log('🌐 If you want to access via web browser:')
    console.log('1. Go to: http://127.0.0.1:3000/auth-test')
    console.log('2. Or try: http://127.0.0.1:3000/simple-dashboard')
    console.log('3. Use credentials:')
    console.log('   📧 Email: shamiur@engineer.com')
    console.log('   🔑 Password: Shahid@221286')
    console.log('')
    console.log('🚨 If redirect loops persist, the messages above are all your contacts!')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await db.$disconnect()
  }
}

showMessagesDirectly()