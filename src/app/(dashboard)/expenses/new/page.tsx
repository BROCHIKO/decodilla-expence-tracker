"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import * as z from "zod"
import { CalendarIcon, Loader2, UploadCloud } from "lucide-react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const expenseFormSchema = z.object({
  date: z.date({
    message: "A date of expense is required.",
  }),
  amount: z.number({
    message: "Amount is required and must be a number."
  }).positive({
    message: "Amount must be a positive number.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  client: z.string({
    message: "Please select a client.",
  }),
  category: z.string({
    message: "Please select an expense category.",
  }),
  paidBy: z.string({
    message: "Please select who paid this expense.",
  }),
  paymentMethod: z.string({
    message: "Please select a payment method.",
  }),
  notes: z.string().optional(),
})

type ExpenseFormValues = z.infer<typeof expenseFormSchema>

export default function AddExpensePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      description: "",
      notes: "",
    },
  })

  async function onSubmit(data: ExpenseFormValues) {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    toast.success("Expense added successfully!")
    router.push("/expenses")
  }

  return (
    <div className="flex-1 space-y-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Add New Expense</h2>
          <p className="text-muted-foreground">Record a new company expense here.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense Details</CardTitle>
          <CardDescription>
            Fill out the details of the transaction. Fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Controller
                  control={control}
                  name="date"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger
                        id="date"
                        className={cn(
                          "w-full pl-3 text-left font-normal inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.date && (
                  <p className="text-[0.8rem] font-medium text-destructive">{errors.date.message}</p>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="amount">Amount (₹) *</Label>
                <Input id="amount" type="number" placeholder="0.00" {...register("amount", { valueAsNumber: true })} />
                {errors.amount && (
                  <p className="text-[0.8rem] font-medium text-destructive">{errors.amount.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Input id="description" placeholder="E.g. Facebook Ads for July Campaign" {...register("description")} />
              {errors.description && (
                <p className="text-[0.8rem] font-medium text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="client">Client / Company *</Label>
                <Controller
                  control={control}
                  name="client"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <SelectTrigger id="client">
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="acme-corp">Acme Corp</SelectItem>
                        <SelectItem value="global-tech">Global Tech</SelectItem>
                        <SelectItem value="internal">Internal (Decodilla)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.client && (
                  <p className="text-[0.8rem] font-medium text-destructive">{errors.client.message}</p>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meta-ads">Meta Ads</SelectItem>
                        <SelectItem value="google-ads">Google Ads</SelectItem>
                        <SelectItem value="software">Software</SelectItem>
                        <SelectItem value="office">Office</SelectItem>
                        <SelectItem value="salary">Salary</SelectItem>
                        <SelectItem value="travel">Travel</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="text-[0.8rem] font-medium text-destructive">{errors.category.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="paidBy">Paid By (Partner) *</Label>
                <Controller
                  control={control}
                  name="paidBy"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <SelectTrigger id="paidBy">
                        <SelectValue placeholder="Select partner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="abhijith-kr">Abhijith KR</SelectItem>
                        <SelectItem value="ananthu-vk">Ananthu V.K</SelectItem>
                        <SelectItem value="riyan-ahmed">Riyan Ahmed</SelectItem>
                        <SelectItem value="company-card">Company Card</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.paidBy && (
                  <p className="text-[0.8rem] font-medium text-destructive">{errors.paidBy.message}</p>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="paymentMethod">Payment Method *</Label>
                <Controller
                  control={control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <SelectTrigger id="paymentMethod">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit-card">Credit Card</SelectItem>
                        <SelectItem value="debit-card">Debit Card</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.paymentMethod && (
                  <p className="text-[0.8rem] font-medium text-destructive">{errors.paymentMethod.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional details about this expense..."
                className="resize-none"
                {...register("notes")}
              />
              {errors.notes && (
                <p className="text-[0.8rem] font-medium text-destructive">{errors.notes.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Receipt</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer">
                <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or PDF (max. 5MB)</p>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" type="button" onClick={() => router.back()} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Expense
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
