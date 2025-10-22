import { db } from './db'

async function seed() {
  try {
    // Add sample projects
    const projects = [
      {
        title: "Secure E-Commerce Platform",
        description: "A full-featured e-commerce platform with advanced security features, payment integration, and real-time inventory management.",
        link: "https://github.com/example/ecommerce-platform",
        category: "E-Commerce",
        tech: "Next.js, TypeScript, Prisma, Stripe, Tailwind CSS"
      },
      {
        title: "Real-Time Collaboration Tool",
        description: "A collaborative workspace with real-time editing, video conferencing, and team management features.",
        link: "https://github.com/example/collaboration-tool",
        category: "Collaboration",
        tech: "Socket.IO, React, Node.js, WebRTC, MongoDB"
      },
      {
        title: "Security Monitoring Dashboard",
        description: "A comprehensive security monitoring dashboard with threat detection, alerting, and incident response capabilities.",
        link: "https://github.com/example/security-dashboard",
        category: "Security",
        tech: "Python, Django, Elasticsearch, React, D3.js"
      }
    ]

    for (const project of projects) {
      await db.project.create({
        data: project
      })
    }

    console.log('Database seeded successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
  }
}

seed()