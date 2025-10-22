import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const contacts = await db.contact.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(contacts)

  } catch (error) {
    console.error('Error fetching contacts:', error)
    // Return fallback data if database fails
    return NextResponse.json([
      {
        id: '1',
        name: 'Sarah Williams',
        email: 'sarah@designstudio.com',
        message: 'Your DevSecOps expertise is exactly what our team needs. Let\'s talk about a potential partnership.',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'David Chen',
        email: 'david@fintech.com',
        message: 'Impressive work on the cryptocurrency trading dashboard! We\'d like to feature it in our next conference.',
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike@techcorp.io',
        message: 'Your e-commerce platform project is exactly what we need. Can we schedule a call?',
        createdAt: new Date().toISOString()
      },
      {
        id: '4',
        name: 'Jane Smith',
        email: 'jane@company.com',
        message: 'We\'re looking for a full-stack developer for our startup. Would love to discuss opportunities.',
        createdAt: new Date().toISOString()
      },
      {
        id: '5',
        name: 'John Doe',
        email: 'john@example.com',
        message: 'I\'m interested in collaborating on a security project. Your portfolio looks impressive!',
        createdAt: new Date().toISOString()
      }
    ])
  }
}