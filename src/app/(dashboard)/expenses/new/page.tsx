"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import * as z from "zod"
import { CalendarIcon, Loader2 } from "lucide-react"
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
import { useStore } from "@/lib/store"

const expenseFormSchema = z.object({
  date: z.date({
    message: "A date of expense is required.",
  }),
  amount: z.number({
    message: "Amount is required and must be a number."
  }).positive({
    message: "Amount must be a positive number.",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  payment: z.string({
    message: "Please select payment method.",
  }),
  note: z.string().optional(),
})

type ExpenseFormValues = z.infer<typeof expenseFormSchema>

export default function AddExpensePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const addExpense = useStore((state) => state.addExpense)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      date: new Date(),
      name: "",
      note: "",
      payment: "Company Card",
    },
  })

  async function onSubmit(data: ExpenseFormValues) {
    setIsSubmitting(true)
    
    addExpense({
      date: format(data.date, "yyyy-MM-dd"),
      amount: data.amount,
      name: data.name,
      payment: data.payment,
      note: data.note,
    })

    // Simulate small delay for UX
    await new Promise((resolve) => setTimeout(resolve, 300))
    setIsSubmitting(false)
    toast.success("Expense added successfully!")
    router.push("/expenses")
  }

  return (
    <div className="flex-1 space-y-4 max-w-3xl mx-auto w-full">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Add Expense</h2>
          <p className="text-muted-foreground">Log a new expense with just the essentials.</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="flex flex-col space-y-2">
              <Label htmlFor="date">Date</Label>
              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger
                      id="date"
                      className={cn(
                        "w-full pl-3 text-left font-normal inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-12 px-4 py-2",
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
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input 
                id="amount" 
                type="number" 
                placeholder="0.00" 
                className="h-12 text-lg font-semibold"
                {...register("amount", { valueAsNumber: true })} 
              />
              {errors.amount && (
                <p className="text-[0.8rem] font-medium text-destructive">{errors.amount.message}</p>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <Label htmlFor="name">Name / Description</Label>
              <Input 
                id="name" 
                className="h-12"
                placeholder="What was this expense for?" 
                {...register("name")} 
              />
              {errors.name && (
                <p className="text-[0.8rem] font-medium text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <Label htmlFor="payment">Payment Method</Label>
              <Controller
                control={control}
                name="payment"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <SelectTrigger id="payment" className="h-12">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Company Card">Company Card</SelectItem>
                      <SelectItem value="Abhijith KR">Paid by Abhijith KR</SelectItem>
                      <SelectItem value="Ananthu V.K">Paid by Ananthu V.K</SelectItem>
                      <SelectItem value="Riyan Ahmed">Paid by Riyan Ahmed</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.payment && (
                <p className="text-[0.8rem] font-medium text-destructive">{errors.payment.message}</p>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <Label htmlFor="note">Note (Optional)</Label>
              <Textarea
                id="note"
                placeholder="Any additional details..."
                className="resize-none min-h-[100px]"
                {...register("note")}
              />
              {errors.note && (
                <p className="text-[0.8rem] font-medium text-destructive">{errors.note.message}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button type="button" variant="outline" className="w-full h-12" onClick={() => router.back()} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" className="w-full h-12" disabled={isSubmitting}>
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
