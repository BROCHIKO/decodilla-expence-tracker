"use client"

import { Download, Calendar, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const statements: any[] = []

export default function StatementsPage() {
  return (
    <div className="flex-1 space-y-6 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Monthly Statements</h2>
          <p className="text-muted-foreground">Review and download consolidated monthly expense statements.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Statement History</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Statement Period</TableHead>
                  <TableHead>Total Expenses</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No monthly statements available yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  statements.map((statement) => (
                    <TableRow key={statement.id}>
                      <TableCell className="font-medium">{statement.month}</TableCell>
                      <TableCell>{statement.totalExpenses}</TableCell>
                      <TableCell>{statement.totalTransactions}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-success/10 text-success hover:bg-success/20 border-transparent">
                          {statement.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" className="hidden sm:flex">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
