"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Search, FileDown, MoreHorizontal, FileEdit, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { exportToCSV } from "@/lib/utils"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Empty data for fresh start
const expenses: any[] = []

export default function ExpensesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredExpenses = expenses.filter(
    (exp) =>
      exp.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Expenses</h2>
          <p className="text-muted-foreground">Manage and track all company expenses here.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => exportToCSV(expenses, "decodilla-expenses")}>
            <FileDown className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Link href="/expenses/new" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Link>
        </div>
      </div>

      <div className="flex items-center py-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExpenses.length === 0 ? (
          <div className="col-span-full h-32 flex items-center justify-center border rounded-xl border-dashed bg-muted/10">
            <p className="text-muted-foreground">No expenses found.</p>
          </div>
        ) : (
          filteredExpenses.map((expense) => (
            <div 
              key={expense.id} 
              className="group relative flex flex-col justify-between p-5 rounded-2xl border bg-card text-card-foreground shadow-sm hover:shadow-md hover:border-primary/20 transition-all cursor-pointer overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-2xl font-bold tracking-tight">{expense.amount}</div>
                  <div className="text-sm text-muted-foreground mt-1 font-medium">{expense.client}</div>
                </div>
                <Badge
                  variant={expense.status === "Pending" ? "outline" : "secondary"}
                  className={
                    expense.status === "Pending"
                      ? "text-warning border-warning/50 bg-warning/5"
                      : "text-success bg-success/10 border-transparent"
                  }
                >
                  {expense.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm mt-2 pt-4 border-t border-border/50">
                <div>
                  <p className="text-muted-foreground text-[11px] uppercase tracking-wider font-semibold mb-1">Category</p>
                  <p className="font-medium">{expense.category}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[11px] uppercase tracking-wider font-semibold mb-1">Paid By</p>
                  <p className="font-medium">{expense.partner}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground text-[11px] uppercase tracking-wider font-semibold mb-1">Date</p>
                  <p className="font-medium">{expense.date}</p>
                </div>
              </div>
              
              {/* Action menu overlay on hover for desktop */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-background border shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 rounded-xl">
                    <DropdownMenuItem>
                      <FileEdit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
