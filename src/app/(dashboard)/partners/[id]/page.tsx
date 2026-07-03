"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"

export default function PartnerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  // React 19 / Next 15 requires unwrapping params via React.use()
  const unwrappedParams = use(params)
  
  const partnersStore = useStore((state) => state.partners)
  const expenses = useStore((state) => state.expenses)
  
  const partner = partnersStore.find((p) => p.id === unwrappedParams.id)
  
  if (!partner) {
    return (
      <div className="flex-1 space-y-6 max-w-4xl mx-auto w-full text-center py-20">
        <h2 className="text-2xl font-bold">Partner not found</h2>
        <Button onClick={() => router.back()} variant="outline" className="mt-4">
          Go Back
        </Button>
      </div>
    )
  }

  // Calculate stats
  const partnerExpenses = expenses.filter(exp => 
    exp.payment.toLowerCase().includes(partner.name.toLowerCase())
  )
  const totalSpent = partnerExpenses.reduce((sum, exp) => sum + exp.amount, 0)
  const pendingReimbursement = partnerExpenses.filter(exp => !exp.isReimbursed).reduce((sum, exp) => sum + exp.amount, 0)

  return (
    <div className="flex-1 space-y-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Partner Profile</h2>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center space-x-4 pb-6">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
              {partner.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <CardTitle className="text-2xl">{partner.name}</CardTitle>
            <p className="text-muted-foreground">{partner.role}</p>
          </div>
          <Badge variant={partner.status === 'Inactive' ? "secondary" : "default"} className={partner.status === 'Inactive' ? "" : "bg-success/10 text-success hover:bg-success/20"}>
            {partner.status || 'Active'}
          </Badge>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2 pt-6 border-t">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Total Spent (YTD)</p>
            <p className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Pending Reimbursement</p>
            <p className="text-2xl font-bold text-warning">₹{pendingReimbursement.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
