"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const PARTNERS = [
  "Riyan Ahmad",
  "Ananthu V.K",
  "Abhijith KR"
]

export default function LoginPage() {
  const router = useRouter()
  const [selectedPartner, setSelectedPartner] = useState("Riyan Ahmad")
  const [passkey, setPasskey] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (passkey === "doobie@2003") {
      setIsLoading(true)
      localStorage.setItem("finance_os_user", selectedPartner)
      
      // Add a small delay for UX before routing
      setTimeout(() => {
        router.push("/")
      }, 500)
    } else {
      setError("Invalid passkey")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center shadow-sm">
            <span className="text-primary-foreground font-bold text-xl">D</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Sign in to Decodilla
            </h1>
            <p className="text-sm text-muted-foreground">
              Select your profile and enter your passkey
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="partner">Partner Profile</Label>
              <Select value={selectedPartner} onValueChange={(val) => setSelectedPartner(val || "")}>
                <SelectTrigger id="partner" className="h-12 rounded-xl bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-colors">
                  <SelectValue placeholder="Select your profile" />
                </SelectTrigger>
                <SelectContent>
                  {PARTNERS.map(partner => (
                    <SelectItem key={partner} value={partner}>
                      {partner}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="passkey">Passkey</Label>
              <Input
                id="passkey"
                type="password"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                disabled={isLoading}
                required
                className="h-12 rounded-xl bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-colors"
                placeholder="••••••••••"
              />
            </div>
            
            {error && (
              <p className="text-sm font-medium text-red-500 mt-2 text-center">
                {error}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full h-12 rounded-xl text-base shadow-sm" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
