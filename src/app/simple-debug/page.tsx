"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SimpleDebug() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('Testing API call...')
        const response = await fetch('/api/public/contacts')
        console.log('Response status:', response.status)
        
        if (response.ok) {
          const result = await response.json()
          console.log('API result:', result)
          setData(result)
        } else {
          console.error('API failed with status:', response.status)
          setData([
            { id: '1', name: 'Test Contact', email: 'test@example.com', message: 'Test message', createdAt: new Date().toISOString() }
          ])
        }
      } catch (error) {
        console.error('API call failed:', error)
        setData([
          { id: '1', name: 'Fallback Contact', email: 'fallback@example.com', message: 'Fallback message', createdAt: new Date().toISOString() }
        ])
      } finally {
        setLoading(false)
      }
    }

    testAPI()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Debug Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Contacts ({data.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {data.map((contact) => (
            <div key={contact.id} className="border-b p-4">
              <h3 className="font-semibold">{contact.name}</h3>
              <p className="text-sm text-gray-600">{contact.email}</p>
              <p className="text-sm">{contact.message}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}