"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for user in localStorage
    const userString = localStorage.getItem('finance_os_user')
    
    if (!userString) {
      if (pathname !== "/login") {
        router.push("/login")
      } else {
        setIsLoading(false)
      }
    } else {
      setIsAuthenticated(true)
      setIsLoading(false)
      
      // If they are on the login page but already authenticated, push them to dashboard
      if (pathname === "/login") {
        router.push("/")
      }
    }
  }, [pathname, router])

  // Don't flash protected content while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // If not authenticated and not on login page, render nothing while redirecting
  if (!isAuthenticated && pathname !== "/login") {
    return null
  }

  return <>{children}</>
}
