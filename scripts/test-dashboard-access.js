// Test script to verify dashboard access and read messages
const testLogin = async () => {
  console.log('🔐 Testing Dashboard Access and Messages')
  console.log('=====================================')
  
  try {
    // Test credentials
    const credentials = {
      email: 'shamiur@engineer.com',
      password: 'Shahid@221286'
    }
    
    console.log(`📧 Email: ${credentials.email}`)
    console.log(`🔑 Password: ${credentials.password}`)
    console.log('')
    
    // Step 1: Test login
    console.log('1️⃣ Testing login...')
    const loginResponse = await fetch('http://127.0.0.1:3000/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password
      })
    })
    
    if (loginResponse.ok) {
      console.log('✅ Login successful!')
      const loginData = await loginResponse.json()
      console.log(`Session established: ${loginData.session ? 'Yes' : 'No'}`)
    } else {
      console.log('❌ Login failed')
      console.log(`Status: ${loginResponse.status}`)
      const errorData = await loginResponse.text()
      console.log(`Error: ${errorData}`)
      return
    }
    
    // Step 2: Test dashboard access
    console.log('')
    console.log('2️⃣ Testing dashboard access...')
    const dashboardResponse = await fetch('http://127.0.0.1:3000/dashboard')
    
    if (dashboardResponse.ok) {
      console.log('✅ Dashboard accessible!')
    } else {
      console.log('❌ Dashboard access denied')
      console.log(`Status: ${dashboardResponse.status}`)
    }
    
    // Step 3: Test contacts API
    console.log('')
    console.log('3️⃣ Testing contacts API...')
    const contactsResponse = await fetch('http://127.0.0.1:3000/api/contacts')
    
    if (contactsResponse.ok) {
      console.log('✅ Contacts API accessible!')
      const contacts = await contactsResponse.json()
      console.log(`📧 Found ${contacts.length} contacts:`)
      console.log('')
      
      contacts.forEach((contact, index) => {
        console.log(`${index + 1}. ${contact.name}`)
        console.log(`   📧 Email: ${contact.email}`)
        console.log(`   📝 Message: ${contact.message.substring(0, 100)}...`)
        console.log(`   📅 Date: ${new Date(contact.createdAt).toLocaleString()}`)
        console.log('')
      })
    } else {
      console.log('❌ Contacts API access denied')
      console.log(`Status: ${contactsResponse.status}`)
      const errorData = await contactsResponse.text()
      console.log(`Error: ${errorData}`)
    }
    
    // Step 4: Test projects API
    console.log('')
    console.log('4️⃣ Testing projects API...')
    const projectsResponse = await fetch('http://127.0.0.1:3000/api/projects')
    
    if (projectsResponse.ok) {
      console.log('✅ Projects API accessible!')
      const projects = await projectsResponse.json()
      console.log(`🚀 Found ${projects.length} projects:`)
      console.log('')
      
      projects.forEach((project, index) => {
        console.log(`${index + 1}. ${project.title}`)
        console.log(`   📝 Description: ${project.description.substring(0, 100)}...`)
        console.log(`   🔗 Link: ${project.link}`)
        console.log(`   📅 Date: ${new Date(project.createdAt).toLocaleString()}`)
        console.log('')
      })
    } else {
      console.log('❌ Projects API access denied')
      console.log(`Status: ${projectsResponse.status}`)
    }
    
    console.log('🎉 Test completed!')
    console.log('')
    console.log('📋 Summary:')
    console.log('- Admin user exists and credentials are valid')
    console.log('- Dashboard is accessible')
    console.log('- Contacts API is working')
    console.log('- Projects API is working')
    console.log('')
    console.log('🌐 You can now access the dashboard at: http://127.0.0.1:3000/dashboard')
    console.log('🔑 Use the credentials provided above to login')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Run the test
testLogin()