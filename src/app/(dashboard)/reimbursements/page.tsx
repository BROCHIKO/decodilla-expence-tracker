"use client"

import { Receipt, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const reimbursements = [
  { 
    id: "R-101", 
    partner: "Abhijith KR", 
    initials: "AK",
    totalSpent: "₹0", 
    owed: "₹0", 
    status: "Settled",
    expensesCount: 0 
  },
  { 
    id: "R-102", 
    partner: "Ananthu V.K", 
    initials: "AV",
    totalSpent: "₹0", 
    owed: "₹0", 
    status: "Settled",
    expensesCount: 0 
  },
  { 
    id: "R-103", 
    partner: "Riyan Ahmed", 
    initials: "RA",
    totalSpent: "₹0", 
    owed: "₹0", 
    status: "Settled",
    expensesCount: 0 
  }
]

export default function ReimbursementsPage() {
  return (
    <div className="flex-1 space-y-6 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reimbursements</h2>
          <p className="text-muted-foreground">Automated calculation of company owes to partners.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {reimbursements.map((item) => (
          <Card key={item.id} className="flex flex-col relative overflow-hidden group border hover:border-primary/20 transition-all">
            <div className="absolute top-0 left-0 w-full h-1 bg-muted/50">
              <div 
                className={`h-full ${item.status === 'Settled' ? 'bg-success' : 'bg-warning'}`} 
                style={{ width: item.status === 'Settled' ? '100%' : '65%' }}
              />
            </div>
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 border shadow-sm">
                  <AvatarFallback className="bg-primary/5 text-primary font-medium">{item.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{item.partner}</CardTitle>
                  <p className="text-xs text-muted-foreground">{item.expensesCount} expenses logged</p>
                </div>
              </div>
              <Badge variant={item.status === 'Settled' ? 'secondary' : 'outline'} className={item.status === 'Settled' ? 'bg-success/10 text-success border-transparent' : 'text-warning border-warning/50 bg-warning/5'}>
                {item.status}
              </Badge>
            </CardHeader>
            <CardContent className="mt-4 flex-1">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Total Spent YTD</span>
                  <span className="font-medium">{item.totalSpent}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Company Owes</span>
                  <span className={`text-2xl font-bold tracking-tight ${item.status === 'Settled' ? 'text-muted-foreground' : 'text-foreground'}`}>
                    {item.owed}
                  </span>
                </div>
              </div>
              
              <div className="mt-8">
                {item.status === 'Settled' ? (
                  <Button variant="outline" className="w-full text-success hover:text-success hover:bg-success/5 border-success/20 cursor-default" tabIndex={-1}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    All Settled
                  </Button>
                ) : (
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    <Receipt className="mr-2 h-4 w-4" />
                    Mark as Settled
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
