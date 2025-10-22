"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function TestDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    console.log("Session status:", status)
    console.log("Session data:", session)
  }, [session, status])

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Test Dashboard</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold">Status: {status}</h2>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Session:</h2>
          <pre className="text-sm bg-gray-100 p-2">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">Actions:</h2>
          <div className="space-y-2 mt-2">
            <button 
              onClick={() => router.push("/auth/signin")}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Go to Sign In
            </button>
            <button 
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 bg-green-500 text-white rounded ml-2"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}