import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "@/hooks/use-toast"
import { z } from "zod"

const ClientFormSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  primary_email: z.string().email("Valid email is required"),
  phone_number: z.string().optional(),
  date_of_birth: z.string().optional(),
  current_country: z.string().optional(),
  uci: z.string().optional(),
  notes: z.string().optional(),
})

type ClientFormData = z.infer<typeof ClientFormSchema>

interface ClientFormProps {
  onClose: () => void
  onSubmit?: (data: ClientFormData) => void | Promise<void>
  initialData?: Partial<ClientFormData>
}

export function ClientForm({ onClose, onSubmit: onSubmitProp, initialData }: ClientFormProps) {
  const form = useForm<ClientFormData>({
    resolver: zodResolver(ClientFormSchema),
    defaultValues: {
      full_name: initialData?.full_name ?? "",
      primary_email: initialData?.primary_email ?? "",
      phone_number: initialData?.phone_number ?? "",
      date_of_birth: initialData?.date_of_birth ?? "",
      current_country: initialData?.current_country ?? "",
      uci: initialData?.uci ?? "",
      notes: initialData?.notes ?? "",
    },
  })

  const onSubmit = async (data: ClientFormData) => {
    try {
      // Filter out empty phone numbers
      const processedData = {
        ...data,
        phone_number: data.phone_number?.trim() || undefined
      }

      if (onSubmitProp) {
        await onSubmitProp(processedData)
      } else {
        // Fallback if no onSubmit provided
        console.log("Creating client:", processedData)
        toast({
          title: "Client created successfully",
          description: `${data.full_name} has been added to your client list.`,
        })
        onClose()
      }
    } catch (error) {
      toast({
        title: "Error creating client",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Legal Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter full legal name" {...field} />
                </FormControl>
                <FormDescription>
                  Name exactly as it appears on passport or official documents
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="primary_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="client@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="current_country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Country</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Canada, United States" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="uci"
            render={({ field }) => (
              <FormItem>
                <FormLabel>UCI (if known)</FormLabel>
                <FormControl>
                  <Input placeholder="Unique Client Identifier" {...field} />
                </FormControl>
                <FormDescription>
                  IRCC Unique Client Identifier (optional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any additional information about the client..."
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Creating..." : "Create Client"}
          </Button>
        </div>
      </form>
    </Form>
  )
}