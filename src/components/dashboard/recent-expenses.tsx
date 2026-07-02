"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileQuestion } from "lucide-react"

type Expense = {
  id: string
  client: string
  category: string
  amount: string
  partner: string
  status: string
  date: string
}

const recentExpenses: Expense[] = []

export function RecentExpenses() {
  if (recentExpenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground space-y-4">
        <FileQuestion className="h-10 w-10 text-muted-foreground/40" />
        <p className="text-sm">No expenses recorded yet.</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentExpenses.map((expense) => (
          <TableRow key={expense.id}>
            <TableCell>
              <div className="font-medium">{expense.client}</div>
              <div className="text-xs text-muted-foreground">{expense.partner} • {expense.date}</div>
            </TableCell>
            <TableCell>{expense.category}</TableCell>
            <TableCell>
              <Badge variant={expense.status === "Pending" ? "outline" : "secondary"}
                className={expense.status === "Pending" ? "text-warning border-warning/50" : "text-success bg-success/10"}
              >
                {expense.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right font-medium">{expense.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
