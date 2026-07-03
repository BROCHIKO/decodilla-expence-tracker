"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { useStore } from "@/lib/store"

const clientFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  contact: z.string().min(2, { message: "Contact info is required." }),
})

type ClientFormValues = z.infer<typeof clientFormSchema>

export default function AddClientPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const addClient = useStore((state) => state.addClient)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: { name: "", contact: "" },
  })

  async function onSubmit(data: ClientFormValues) {
    setIsSubmitting(true)
    addClient(data)
    await new Promise((resolve) => setTimeout(resolve, 300))
    setIsSubmitting(false)
    toast.success("Client added successfully!")
    router.push("/clients")
  }

  return (
    <div className="flex-1 space-y-4 max-w-xl mx-auto w-full">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Add Client</h2>
          <p className="text-muted-foreground">Register a new client profile.</p>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="name">Client Name</Label>
              <Input id="name" className="h-12" placeholder="e.g. Acme Corp" {...register("name")} />
              {errors.name && <p className="text-[0.8rem] font-medium text-destructive">{errors.name.message}</p>}
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="contact">Primary Contact</Label>
              <Input id="contact" className="h-12" placeholder="Email or Phone" {...register("contact")} />
              {errors.contact && <p className="text-[0.8rem] font-medium text-destructive">{errors.contact.message}</p>}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1 h-12" onClick={() => router.back()} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 h-12" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Client
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
