"use client"

import { useStore } from "@/lib/store"
import { useMemo, useEffect, useState } from "react"
import { format, parseISO } from "date-fns"
import { useRouter } from "next/navigation"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#ec4899", "#64748b"]

export default function AnalyticsPage() {
  const allExpenses = useStore((state) => state.expenses)
  const categories = useStore((state) => state.categories)
  const partners = useStore((state) => state.partners)
  const [currentUser, setCurrentUser] = useState<string>("Company Admin")

  useEffect(() => {
    const userString = localStorage.getItem('finance_os_user')
    if (userString) {
      setCurrentUser(userString)
    }
  }, [])

  const expenses = currentUser === "Company Admin" 
    ? allExpenses 
    : allExpenses.filter(exp => exp.payment === currentUser || exp.partnerId === partners.find(p => p.name === currentUser)?.id)



  const monthlyData = useMemo(() => {
    const months = new Map<string, number>()
    expenses.forEach(exp => {
      if (!exp.date) return
      const monthStr = exp.date.substring(0, 7)
      const current = months.get(monthStr) || 0
      months.set(monthStr, current + exp.amount)
    })
    
    const sortedMonths = Array.from(months.entries()).sort((a, b) => a[0].localeCompare(b[0]))
    
    return sortedMonths.map(([monthStr, amount]) => {
      const date = parseISO(`${monthStr}-01`)
      return {
        name: format(date, "MMM"),
        expenses: amount
      }
    })
  }, [expenses])

  const categoryData = useMemo(() => {
    const catAmounts = new Map<string, number>()
    
    expenses.forEach(exp => {
      const catName = exp.categoryId 
        ? (categories.find(c => c.id === exp.categoryId)?.name || "Other")
        : "Uncategorized"
        
      const current = catAmounts.get(catName) || 0
      catAmounts.set(catName, current + exp.amount)
    })
    
    return Array.from(catAmounts.entries())
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .sort((a, b) => b.value - a.value)
  }, [expenses, categories])


  return (
    <div className="flex-1 space-y-6 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">Deep dive into your company's spending patterns.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Spending Over Time</CardTitle>
            <CardDescription>Monthly expense trend for the current year</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis 
                  dataKey="name" 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `₹${value / 1000}k`} 
                />
                <Tooltip 
                  formatter={(value: any) => [`₹${Number(value || 0).toLocaleString()}`, "Expenses"]}
                  cursor={{ fill: "transparent" }}
                />
                <Bar 
                  dataKey="expenses" 
                  fill="currentColor" 
                  radius={[4, 4, 0, 0]} 
                  className="fill-primary"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
            <CardDescription>Breakdown of spending across categories</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`₹${Number(value || 0).toLocaleString()}`, "Amount"]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
