import { db } from '../src/lib/db'

async function addSampleContacts() {
  try {
    // Check if contacts already exist
    const existingContacts = await db.contact.count()
    
    if (existingContacts > 0) {
      console.log(`✅ Already have ${existingContacts} contacts in database`)
      return
    }

    // Add sample contacts
    const sampleContacts = [
      {
        name: "John Doe",
        email: "john@example.com",
        message: "I'm interested in collaborating on a security project. Your portfolio looks impressive!"
      },
      {
        name: "Jane Smith",
        email: "jane@company.com",
        message: "We're looking for a full-stack developer for our startup. Would love to discuss opportunities."
      },
      {
        name: "Mike Johnson",
        email: "mike@techcorp.io",
        message: "Your e-commerce platform project is exactly what we need. Can we schedule a call?"
      },
      {
        name: "Sarah Williams",
        email: "sarah@designstudio.com",
        message: "Your DevSecOps expertise is exactly what our team needs. Let's talk about a potential partnership."
      },
      {
        name: "David Chen",
        email: "david@fintech.com",
        message: "Impressive work on the cryptocurrency trading dashboard! We'd like to feature it in our next conference."
      }
    ]

    for (const contact of sampleContacts) {
      await db.contact.create({
        data: contact
      })
    }

    console.log(`✅ Added ${sampleContacts.length} sample contacts to database`)
    
    // Display all contacts
    const allContacts = await db.contact.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    console.log('\n📧 All Contacts:')
    allContacts.forEach((contact, index) => {
      console.log(`${index + 1}. ${contact.name} (${contact.email})`)
      console.log(`   Message: ${contact.message.substring(0, 100)}...`)
      console.log(`   Date: ${contact.createdAt.toLocaleString()}`)
      console.log('')
    })

  } catch (error) {
    console.error('❌ Error adding sample contacts:', error)
  } finally {
    await db.$disconnect()
  }
}

addSampleContacts()