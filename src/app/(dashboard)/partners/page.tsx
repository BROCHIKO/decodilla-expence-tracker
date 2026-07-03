"use client"

import { Plus, Search, MoreHorizontal, FileText, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import Link from "next/link"
import { useStore } from "@/lib/store"

export default function PartnersPage() {
  const partnersStore = useStore((state) => state.partners)
  const expenses = useStore((state) => state.expenses)

  // Calculate dynamic stats for each partner from the expenses array
  const partners = partnersStore.map(partner => {
    // Look for expenses where the payment method references the partner's name
    const partnerExpenses = expenses.filter(exp => 
      exp.payment.toLowerCase().includes(partner.name.toLowerCase())
    )
    const totalSpent = partnerExpenses.reduce((sum, exp) => sum + exp.amount, 0)
    
    return {
      ...partner,
      status: "Active",
      totalSpent,
      pendingReimbursement: totalSpent // Assuming all are pending for now
    }
  })

  // Summary Card Calculations
  const activePartnersCount = partners.filter(p => p.status === 'Active').length
  const totalPending = partners.reduce((sum, p) => sum + p.pendingReimbursement, 0)

  return (
    <div className="flex-1 space-y-6 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Partners</h2>
          <p className="text-muted-foreground">Manage partner profiles and reimbursements.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/partners/new" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
            <Plus className="mr-2 h-4 w-4" />
            Add Partner
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pending Reimbursements</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalPending.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all active partners</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Partners</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePartnersCount}</div>
            <p className="text-xs text-muted-foreground">Currently active in system</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center py-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search partners..." className="pl-8" />
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Partner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Spent (YTD)</TableHead>
              <TableHead className="text-right">Pending Reimbursement</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partners.map((partner) => (
              <TableRow key={partner.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={partner.name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">{partner.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{partner.name}</div>
                      <div className="text-xs text-muted-foreground">{partner.role}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-success bg-success/10">
                    Active
                  </Badge>
                </TableCell>
                <TableCell>₹{partner.totalSpent.toLocaleString()}</TableCell>
                <TableCell className="text-right font-medium text-warning">₹{partner.pendingReimbursement.toLocaleString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-md transition-colors hover:bg-accent">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Settle Reimbursement</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
