import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const projects = await db.project.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(projects)

  } catch (error) {
    console.error('Error fetching projects:', error)
    // Return fallback data if database fails
    return NextResponse.json([
      {
        id: '1',
        title: 'DevSecOps Pipeline Automation',
        description: 'Automated security scanning and CI/CD pipeline with real-time monitoring and vulnerability assessment.',
        link: 'https://github.com/sunny/devsecops-pipeline',
        featured: true,
        views: 1250,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Cryptocurrency Trading Dashboard',
        description: 'Real-time trading dashboard with advanced charting, portfolio tracking, and automated trading strategies.',
        link: 'https://github.com/sunny/crypto-dashboard',
        featured: true,
        views: 890,
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        title: 'E-Commerce Security Platform',
        description: 'Secure e-commerce platform with advanced fraud detection, payment processing, and inventory management.',
        link: 'https://github.com/sunny/ecommerce-security',
        featured: false,
        views: 650,
        createdAt: new Date().toISOString()
      }
    ])
  }
}