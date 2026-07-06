"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  IndianRupee, 
  Users, 
  Briefcase, 
  TrendingUp,
  CreditCard,
  Clock
} from "lucide-react"
import { ExpenseTrend } from "@/components/dashboard/expense-trend"
import { RecentExpenses } from "@/components/dashboard/recent-expenses"

import Link from "next/link"
import { useStore } from "@/lib/store"
import { useEffect, useState } from "react"

export default function Dashboard() {
  const allExpenses = useStore((state) => state.expenses)
  const clients = useStore((state) => state.clients)
  const partners = useStore((state) => state.partners)

  const [currentUser, setCurrentUser] = useState<string>("Company Admin")

  useEffect(() => {
    const userString = localStorage.getItem('finance_os_user')
    if (userString) {
      setCurrentUser(userString)
    }
  }, [])

  // Filter expenses: Company Admin sees all, Partners see only their own
  const expenses = currentUser === "Company Admin" 
    ? allExpenses 
    : allExpenses.filter(exp => exp.payment === currentUser || exp.partnerId === partners.find(p => p.name === currentUser)?.id)


  // Calculations
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  
  const currentMonth = new Date().toISOString().slice(0, 7) // "YYYY-MM"
  const thisMonthExpenses = expenses
    .filter((exp) => exp.date.startsWith(currentMonth))
    .reduce((sum, exp) => sum + exp.amount, 0)
    
  // Unique months logic for Avg Monthly Expense
  const uniqueMonths = new Set(expenses.map(exp => exp.date.slice(0, 7)))
  const totalMonths = uniqueMonths.size
  // Math Safety: Prevent divide by zero or NaN
  const avgMonthlyExpense = totalMonths > 0 ? totalExpenses / totalMonths : 0

  const pendingReimbursements = expenses
    .filter(exp => exp.partnerId && !exp.isReimbursed)
    .reduce((sum, exp) => sum + exp.amount, 0)

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalExpenses.toLocaleString()}</div>
            {expenses.length === 0 ? (
              <Link href="/expenses/new" className="text-xs text-primary hover:underline mt-1 inline-block font-medium">
                Add your first expense
              </Link>
            ) : (
              <p className="text-xs text-muted-foreground mt-1">Across all time</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{thisMonthExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Current month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reimbursements</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{pendingReimbursements.toLocaleString()}</div>
            {pendingReimbursements === 0 ? (
              <p className="text-xs text-muted-foreground mt-1">All settled</p>
            ) : (
              <p className="text-xs text-warning mt-1">Needs attention</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
            {clients.length === 0 ? (
              <Link href="/clients/new" className="text-xs text-primary hover:underline mt-1 inline-block font-medium">
                Add your first client
              </Link>
            ) : (
              <p className="text-xs text-muted-foreground mt-1">Total active clients</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Partners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{partners.length}</div>
            {partners.length === 0 ? (
              <Link href="/partners/new" className="text-xs text-primary hover:underline mt-1 inline-block font-medium">
                Setup partner profiles
              </Link>
            ) : (
              <p className="text-xs text-muted-foreground mt-1">Registered partners</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Monthly Expense</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{Math.round(avgMonthlyExpense).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Year to date</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Expense Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ExpenseTrend />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentExpenses />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
