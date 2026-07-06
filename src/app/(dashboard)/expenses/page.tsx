"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Search, FileDown, MoreHorizontal, FileEdit, Trash, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { exportToCSV } from "@/lib/utils"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useStore } from "@/lib/store"

export default function ExpensesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const allExpenses = useStore((state) => state.expenses)
  const partners = useStore((state) => state.partners)
  const deleteExpense = useStore((state) => state.deleteExpense)

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


  const filteredExpenses = expenses.filter(
    (exp) =>
      exp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.payment.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const exportToPDF = async () => {
    const doc = new jsPDF()
    
    try {
      const img = new Image()
      img.src = '/logo.png'
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
      })
      
      const canvas = document.createElement('canvas')
      // Scale down image to reduce PDF bloat
      const scale = Math.min(200 / img.width, 1)
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL('image/png')
      
      // Calculate aspect ratio for placing in PDF
      const aspectRatio = img.width / img.height
      doc.addImage(dataUrl, 'PNG', 14, 10, 30 * aspectRatio, 30)
    } catch (e) {
      console.error("Failed to load logo", e)
    }
    
    doc.setFontSize(18)
    doc.text("Total Expenses Report", 14, 50)
    
    doc.setFontSize(11)
    doc.setTextColor(100)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 60)
    
    const tableData = expenses.map(exp => [
      exp.date,
      exp.name,
      exp.payment,
      `Rs. ${exp.amount.toLocaleString('en-IN')}`
    ])
    
    autoTable(doc, {
      startY: 65,
      head: [['Date', 'Description', 'Payment Method', 'Amount']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
    })
    
    const totalSum = expenses.reduce((sum, exp) => sum + exp.amount, 0)
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finalY = (doc as any).lastAutoTable?.finalY || 65
    
    doc.setFontSize(12)
    doc.setTextColor(0)
    doc.setFont("helvetica", "bold")
    doc.text(`Total Expenses: Rs. ${totalSum.toLocaleString('en-IN')}`, 14, finalY + 10)
    
    doc.save("expenses_report.pdf")
  }

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
          <Button variant="secondary" onClick={exportToPDF}>
            <FileText className="mr-2 h-4 w-4" />
            Export PDF
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
                  <div className="text-2xl font-bold tracking-tight">₹{expense.amount}</div>
                  <div className="text-sm text-muted-foreground mt-1 font-medium line-clamp-1">{expense.name}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm mt-2 pt-4 border-t border-border/50">
                <div>
                  <p className="text-muted-foreground text-[11px] uppercase tracking-wider font-semibold mb-1">Payment</p>
                  <p className="font-medium line-clamp-1">{expense.payment}</p>
                </div>
                <div>
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
                    <DropdownMenuItem 
                      className="cursor-pointer"
                      onClick={() => router.push(`/expenses/${expense.id}/edit`)}
                    >
                      <FileEdit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive cursor-pointer"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this expense?")) {
                          deleteExpense(expense.id)
                        }
                      }}
                    >
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
