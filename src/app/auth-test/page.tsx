"use client"

import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export default function AuthTestPage() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {session ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                Authenticated
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-red-500" />
                Not Authenticated
              </>
            )}
          </CardTitle>
          <CardDescription>
            Authentication status check
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {session ? (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Welcome, {session.user?.name || session.user?.email}!
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> {session.user?.email}</p>
                <p><strong>Name:</strong> {session.user?.name || 'Not set'}</p>
                <p><strong>Status:</strong> Authenticated</p>
              </div>
              <div className="mt-4 space-y-2">
                <Button 
                  className="w-full" 
                  onClick={() => window.location.href = "/dashboard"}
                >
                  Go to Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = "/auth/signin"}
                >
                  Back to Login
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                You are not currently authenticated.
              </p>
              <Button 
                className="w-full"
                onClick={() => window.location.href = "/auth/signin"}
              >
                Go to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}