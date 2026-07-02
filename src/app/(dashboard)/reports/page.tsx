"use client"

import { Download, FileText, Calendar as CalendarIcon, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const reportTemplates = [
  { id: 1, title: "Monthly Expense Summary", description: "A high-level overview of all expenses categorized by type for the selected month.", type: "PDF" },
  { id: 2, title: "Client Billing Report", description: "Detailed breakdown of expenses attributed to specific clients for invoicing.", type: "CSV" },
  { id: 3, title: "Partner Reimbursement Report", description: "List of out-of-pocket expenses pending reimbursement to partners.", type: "Excel" },
  { id: 4, title: "Tax Deductible Expenses", description: "Filtered list of expenses categorized under tax-deductible categories.", type: "PDF" },
]

import { exportToCSV } from "@/lib/utils"

// Dummy data for reports
const dummyReportData = [
  { Date: "2026-07-01", Client: "Acme Corp", Category: "Meta Ads", Amount: 125000, Partner: "Admin User", Status: "Reimbursed" },
  { Date: "2026-07-02", Client: "Global Tech", Category: "Software", Amount: 45000, Partner: "Ananthu V.K", Status: "Pending" }
]

export default function ReportsPage() {
  const handleGenerate = (report: any) => {
    if (report.type === "CSV" || report.type === "Excel") {
      exportToCSV(dummyReportData, `Report_${report.title.replace(/\s+/g, "_")}`)
    } else {
      // PDF simulation
      exportToCSV(dummyReportData, `PDF_Data_Export_${report.title.replace(/\s+/g, "_")}`)
    }
  }

  return (
    <div className="flex-1 space-y-6 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">Generate and download standard financial reports.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => exportToCSV(dummyReportData, "custom_report")}>
            <Filter className="mr-2 h-4 w-4" />
            Custom Report
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 py-4 bg-muted/50 p-4 rounded-lg border">
        <div className="flex-1">
          <label className="text-sm font-medium mb-1.5 block">Time Period</label>
          <Select defaultValue="this-month">
            <SelectTrigger>
              <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="q1">Q1 2026</SelectItem>
              <SelectItem value="q2">Q2 2026</SelectItem>
              <SelectItem value="year-to-date">Year to Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium mb-1.5 block">Format</label>
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Formats</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button className="w-full sm:w-auto">Apply Filters</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {reportTemplates.map((report) => (
          <Card key={report.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    {report.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {report.description}
                  </CardDescription>
                </div>
                <Badge variant="secondary">{report.type}</Badge>
              </div>
            </CardHeader>
            <CardFooter className="mt-auto pt-4 border-t">
              <Button variant="ghost" className="w-full justify-between group" onClick={() => handleGenerate(report)}>
                Generate Report
                <Download className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
