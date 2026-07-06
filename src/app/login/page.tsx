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
  { id: "riyan", name: "Riyan Ahmad", initials: "RA" },
  { id: "ananthu", name: "Ananthu V.K", initials: "AV" },
  { id: "abhijith", name: "Abhijith KR", initials: "AK" },
]

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<string>("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setError(null)
    
    if (!selectedUser) {
      setError("Please select a partner.")
      return
    }

    if (password !== "doobie@2003") {
      setError("Invalid passkey.")
      return
    }

    setIsLoading(true)

    const selectedPartner = PARTNERS.find(p => p.name === selectedUser)
    
    if (selectedPartner) {
      // Small delay for UX
      setTimeout(() => {
        localStorage.setItem("finance_os_user", JSON.stringify(selectedPartner))
        router.push("/")
      }, 600)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center shadow-sm">
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

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="partner">Partner Profile</Label>
              <Select value={selectedUser} onValueChange={(val) => setSelectedUser(val || "")} required>
                <SelectTrigger id="partner" className="h-12 rounded-xl bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-colors">
                  <SelectValue placeholder="Select your profile" />
                </SelectTrigger>
                <SelectContent>
                  {PARTNERS.map(partner => (
                    <SelectItem key={partner.name} value={partner.name}>
                      {partner.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Passkey</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                className="h-12 rounded-xl bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-colors"
                placeholder="••••••••••"
              />
            </div>
            
            {error && (
              <p className="text-sm font-medium text-destructive mt-2 text-center">
                {error}
              </p>
            )}
          </div>

          <Button className="w-full h-12 rounded-xl text-base shadow-sm" disabled={isLoading}>
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
