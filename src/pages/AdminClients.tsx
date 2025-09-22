import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Copy, Plus, Eye, Send } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link } from "react-router-dom"

const CreateClientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"), 
  formType: z.enum(["WP", "SV", "PR"]).refine((val) => val, {
    message: "Form type is required"
  }),
})

type CreateClientData = z.infer<typeof CreateClientSchema>

const formTypeLabels = {
  WP: "Work Permit",
  SV: "Visitor/Super Visa", 
  PR: "Permanent Residence"
}

// Mock data - replace with actual API calls
const mockClients = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    formType: "WP",
    token: "work-permit-demo",
    createdAt: new Date("2024-01-15"),
    responses: []
  },
  {
    id: "2",
    name: "Maria Garcia",
    email: "maria@example.com",
    formType: "PR",
    token: "pr-demo",
    createdAt: new Date("2024-01-10"),
    responses: [{ id: "1", submitted: true }],
    submitted: true,
    submittedAt: new Date("2024-01-10")
  },
  {
    id: "3",
    name: "Sarah Chen",
    email: "sarah@example.com",
    formType: "SV",
    token: "visitor-visa-demo",
    createdAt: new Date("2024-01-12"),
    responses: [{ id: "1", submitted: true }],
    submitted: true,
    submittedAt: new Date("2024-01-12")
  },
  {
    id: "4",
    name: "Ahmed Hassan",
    email: "ahmed@example.com",
    formType: "WP",
    token: "abc123def456",
    createdAt: new Date("2024-01-20"),
    responses: []
  },
  {
    id: "5",
    name: "Elena Rodriguez",
    email: "elena@example.com",
    formType: "SV",
    token: "xyz789uvw012",
    createdAt: new Date("2024-01-18"),
    responses: []
  }
]

export default function AdminClients() {
  const [clients, setClients] = useState(mockClients)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const form = useForm<CreateClientData>({
    resolver: zodResolver(CreateClientSchema),
    defaultValues: {
      name: "",
      email: "",
      formType: undefined,
    },
  })

  const onSubmit = async (data: CreateClientData) => {
    try {
      // Generate unique token
      const token = Math.random().toString(36).substr(2, 16)
      
      const newClient = {
        id: Date.now().toString(),
        ...data,
        token,
        createdAt: new Date(),
        responses: []
      }

      setClients([...clients, newClient])
      
      toast({
        title: "Client created successfully",
        description: `${data.name} has been added with token: ${token}`,
      })
      
      setIsCreateDialogOpen(false)
      form.reset()
    } catch (error) {
      toast({
        title: "Error creating client",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const copyLink = (token: string) => {
    const link = `${window.location.origin}/form/${token}`
    navigator.clipboard.writeText(link)
    toast({
      title: "Link copied!",
      description: "Form link has been copied to clipboard.",
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Manage client intake forms</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Client</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  placeholder="Client full name"
                  {...form.register("name")}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="client@example.com"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>
              
              <div>
                <Label>Form Type</Label>
                <Select onValueChange={(value) => form.setValue("formType", value as "WP" | "SV" | "PR")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select form type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WP">Work Permit</SelectItem>
                    <SelectItem value="SV">Visitor/Super Visa</SelectItem>
                    <SelectItem value="PR">Permanent Residence</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.formType && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.formType.message}</p>
                )}
              </div>
              
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  Create Client
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {clients.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <h3 className="text-lg font-semibold mb-2">No clients yet</h3>
            <p className="text-muted-foreground mb-4">Create your first client to get started</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {clients.map((client) => (
            <Card key={client.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{client.name}</h3>
                      <Badge variant="secondary">
                        {formTypeLabels[client.formType as keyof typeof formTypeLabels]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{client.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Created {client.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {client.responses.length > 0 && (
                      <Link to={`/admin/responses/${client.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Responses ({client.responses.length})
                        </Button>
                      </Link>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyLink(client.token)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </Button>
                    
                    <Button 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Form sent!",
                          description: `Form has been sent to ${client.email}`,
                        })
                      }}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send the form to the client seekers
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-muted rounded text-sm">
                  <strong>Form Link:</strong> /form/{client.token}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}