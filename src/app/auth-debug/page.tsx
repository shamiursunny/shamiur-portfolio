"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export default function AuthDebugPage() {
  const { data: session, status } = useSession()
  const [apiTest, setApiTest] = useState<string>("")

  useEffect(() => {
    // Test API connection
    fetch("/api/health")
      .then(res => res.json())
      .then(data => setApiTest("API OK: " + JSON.stringify(data)))
      .catch(err => setApiTest("API Error: " + err.message))
  }, [])

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Debug</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold">Session Status: {status}</h2>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Session Data:</h2>
          <pre className="text-sm bg-gray-100 p-2 rounded">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">API Test:</h2>
          <pre className="text-sm bg-gray-100 p-2 rounded">
            {apiTest}
          </pre>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Environment:</h2>
          <p>NextAuth URL: {process.env.NEXTAUTH_URL}</p>
          <p>Node Env: {process.env.NODE_ENV}</p>
        </div>
      </div>
    </div>
  )
}