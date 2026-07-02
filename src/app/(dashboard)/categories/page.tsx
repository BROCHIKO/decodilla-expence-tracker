"use client"

import { useState } from "react"
import { Plus, Settings2, Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const initialCategories = [
  { id: "CAT-1", name: "Meta Ads", type: "Marketing", count: 0, status: "Active" },
  { id: "CAT-2", name: "Google Ads", type: "Marketing", count: 0, status: "Active" },
  { id: "CAT-3", name: "Software Subscriptions", type: "Operations", count: 0, status: "Active" },
  { id: "CAT-4", name: "Office Supplies", type: "Operations", count: 0, status: "Active" },
  { id: "CAT-5", name: "Salary", type: "Payroll", count: 0, status: "Active" },
  { id: "CAT-6", name: "Travel", type: "Miscellaneous", count: 0, status: "Active" },
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState(initialCategories)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newCatName, setNewCatName] = useState("")
  const [newCatType, setNewCatType] = useState("Operations")

  const handleDelete = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id))
  }

  const handleAddCategory = () => {
    if (!newCatName.trim()) return

    const newCategory = {
      id: `CAT-${Math.floor(Math.random() * 10000)}`,
      name: newCatName,
      type: newCatType,
      count: 0,
      status: "Active"
    }

    setCategories([...categories, newCategory])
    setNewCatName("")
    setIsAddOpen(false)
  }

  return (
    <div className="flex-1 space-y-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">Manage expense categories and organizational types.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger render={<Button />}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>
                  Create a new category bucket to track specific expenses.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g. Travel, Software"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Input
                    id="type"
                    value={newCatType}
                    onChange={(e) => setNewCatType(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g. Operations, Marketing"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" onClick={handleAddCategory}>Save Category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Expense Categories</CardTitle>
          </div>
          <CardDescription>
            Categorizing expenses correctly helps with analytics and reporting.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Expenses Count</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No categories found. Click 'Add Category' to create one.
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.type}</TableCell>
                      <TableCell>{category.count}</TableCell>
                      <TableCell>
                        <Badge variant={category.status === "Active" ? "secondary" : "outline"} className={category.status === "Active" ? "text-success bg-success/10 border-transparent" : "text-muted-foreground"}>
                          {category.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4 text-muted-foreground" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:text-destructive hover:bg-destructive/10 transition-colors"
                            onClick={() => handleDelete(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
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
