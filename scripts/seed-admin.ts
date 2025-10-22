import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'shamiur@engineer.com' }
    })

    if (existingAdmin) {
      console.log('Admin user already exists')
      return
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('Shahid@221286', 12)
    
    const admin = await prisma.user.create({
      data: {
        name: 'Shamiur Rashid Sunny',
        email: 'shamiur@engineer.com',
        password: hashedPassword,
      },
    })

    console.log('Admin user created successfully:', admin.email)
    console.log('Email: shamiur@engineer.com')
    console.log('Password: Shahid@221286')
    console.log('Please change the password after first login!')

    // Create sample projects
    const sampleProjects = [
      {
        title: 'Secure E-Commerce Platform',
        description: 'A full-featured e-commerce platform with advanced security features, payment integration, and real-time inventory management.',
        link: 'https://github.com/sunny/ecommerce-platform',
        category: 'E-Commerce',
        tech: JSON.stringify(['Next.js', 'TypeScript', 'Prisma', 'Stripe']),
        featured: true
      },
      {
        title: 'Real-Time Collaboration Tool',
        description: 'A WebSocket-based collaboration platform with video conferencing, screen sharing, and real-time document editing.',
        link: 'https://github.com/sunny/collaboration-tool',
        category: 'Collaboration',
        tech: JSON.stringify(['Socket.IO', 'WebRTC', 'React', 'Node.js']),
        featured: true
      },
      {
        title: 'Security Monitoring Dashboard',
        description: 'A comprehensive security monitoring solution with real-time threat detection, alerting, and automated response capabilities.',
        link: 'https://github.com/sunny/security-dashboard',
        category: 'Security',
        tech: JSON.stringify(['Python', 'ELK Stack', 'Docker', 'Kubernetes']),
        featured: true
      }
    ]

    for (const project of sampleProjects) {
      await prisma.project.create({
        data: project
      })
    }

    console.log('Sample projects created successfully!')

  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()