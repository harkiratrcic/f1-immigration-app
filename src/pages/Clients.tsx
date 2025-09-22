import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Search, Filter, MoreHorizontal, Phone, Mail, Globe, Users, Send, Eye, Copy, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ClientForm } from "@/components/forms/client-form"
import { api } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function Clients() {
  const navigate = useNavigate()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isSendFormDialogOpen, setIsSendFormDialogOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Record<string, any> | null>(null)
  const [clients, setClients] = useState<Record<string, any>[]>([])
  const [invites, setInvites] = useState<Record<string, any>[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("clients")
  const [formType, setFormType] = useState("")

  useEffect(() => {
    fetchClients()
    fetchInvites()
  }, [])

  const fetchClients = async () => {
    try {
      const data = await api.getClients()
      setClients(data)
    } catch (error) {
      console.error("Error fetching clients:", error)
      toast({
        title: "Error",
        description: "Failed to fetch clients",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchInvites = async () => {
    try {
      const data = await api.getInvites()
      setInvites(data)
    } catch (error) {
      console.error("Error fetching invites:", error)
    }
  }

  const handleCreateClient = async (data: Record<string, any>) => {
    try {
      console.log('🎯 Creating client with data:', data);
      const result = await api.createClient(data)
      console.log('✅ Client creation successful:', result);
      toast({
        title: "Success",
        description: "Client created successfully"
      })
      setIsCreateDialogOpen(false)
      fetchClients()
    } catch (error) {
      console.error('❌ Client creation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: "Error",
        description: `Failed to create client: ${errorMessage}`,
        variant: "destructive"
      })
    }
  }

  const handleSendForm = async () => {
    if (!selectedClient || !formType) {
      toast({
        title: "Error",
        description: "Please select a client and form type",
        variant: "destructive"
      })
      return
    }

    try {
      const response = await api.sendInvite({
        client_id: selectedClient.id,
        form_type: formType,
        email: selectedClient.primary_email
      })

      toast({
        title: "Success",
        description: `Form sent to ${selectedClient.primary_email}`
      })

      setIsSendFormDialogOpen(false)
      setSelectedClient(null)
      setFormType("")
      fetchInvites()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send form",
        variant: "destructive"
      })
    }
  }

  const handleDialogClose = (open: boolean) => {
    setIsSendFormDialogOpen(open)
    if (!open) {
      // Reset form when dialog closes
      setSelectedClient(null)
      setFormType("")
    }
  }

  const copyLink = (token: string) => {
    const link = `${window.location.origin}/form/${token}`
    navigator.clipboard.writeText(link)
    toast({
      title: "Link copied!",
      description: "Form link has been copied to clipboard."
    })
  }

  const resendInvite = async (inviteId: string) => {
    try {
      await api.resendInvite(inviteId)
      toast({
        title: "Success",
        description: "Invite resent successfully"
      })
      fetchInvites()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend invite",
        variant: "destructive"
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return 'bg-success text-success-foreground'
      case 'OPEN': return 'bg-warning text-warning-foreground'
      case 'SENT': return 'bg-primary text-primary-foreground'
      case 'DRAFT': return 'bg-muted text-muted-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const filteredClients = clients.filter(client =>
    client.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.primary_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.uci?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formTypeLabels: Record<string, string> = {
    WORK_PERMIT: "Work Permit",
    VISITOR_SUPERVISA: "Visitor/Super Visa",
    PERMANENT_RESIDENCE: "Permanent Residence"
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Clients</h1>
          <p className="text-muted-foreground">
            Manage your immigration clients and their information.
          </p>
        </div>

        <div className="flex gap-3">
          <Dialog open={isSendFormDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Send className="h-4 w-4 mr-2" />
                Send Form
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Form to Client</DialogTitle>
                <DialogDescription>
                  {selectedClient
                    ? `Send a form to ${selectedClient.full_name}`
                    : "Select a client and form type to send"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {selectedClient ? (
                  // Show selected client info
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Sending to:</Label>
                        <div className="mt-1">
                          <p className="font-medium">{selectedClient.full_name}</p>
                          <p className="text-sm text-muted-foreground">{selectedClient.primary_email}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedClient(null)}
                      >
                        Change
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Show client selector
                  <div>
                    <Label>Client</Label>
                    <Select onValueChange={(value) => setSelectedClient(clients.find(c => c.id === value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map(client => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.full_name} - {client.primary_email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label>Form Type</Label>
                  <Select onValueChange={setFormType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select form type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WORK_PERMIT">Work Permit</SelectItem>
                      <SelectItem value="VISITOR_SUPERVISA">Visitor/Super Visa</SelectItem>
                      <SelectItem value="PERMANENT_RESIDENCE">Permanent Residence</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSendForm} className="w-full">
                  Send Form
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Client
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
                <DialogDescription>
                  Create a new client profile. You can add immigration files later.
                </DialogDescription>
              </DialogHeader>
              <ClientForm onClose={() => setIsCreateDialogOpen(false)} onSubmit={handleCreateClient} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="invites">Invites</TabsTrigger>
        </TabsList>

        {/* Clients Tab */}
        <TabsContent value="clients" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients by name, email, or UCI..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Clients Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredClients.map((client) => (
              <Card key={client.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(client.full_name || "NN")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{client.full_name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            {client.files?.length || 0} files
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setSelectedClient(client)
                          setIsSendFormDialogOpen(true)
                        }}>
                          Send Form
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/clients/${client.id}`)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit Client</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{client.primary_email}</span>
                    </div>
                    {client.phone_number && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{client.phone_number}</span>
                      </div>
                    )}
                    {client.current_country && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Globe className="h-3 w-3" />
                        <span>{client.current_country}</span>
                      </div>
                    )}
                  </div>

                  {client.uci && (
                    <div className="text-xs text-muted-foreground pt-2 border-t">
                      UCI: {client.uci}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredClients.length === 0 && !loading && (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="mb-2">No clients found</CardTitle>
                <CardDescription className="mb-4">
                  {searchQuery ? "Try adjusting your search" : "Get started by adding your first client"}
                </CardDescription>
                {!searchQuery && (
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Client
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Invites Tab */}
        <TabsContent value="invites" className="space-y-4">
          <div className="grid gap-4">
            {invites.map((invite) => (
              <Card key={invite.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">
                          {invite.instance?.file?.client?.full_name || "Unknown Client"}
                        </h3>
                        <Badge className={getStatusColor(invite.instance?.status)}>
                          {invite.instance?.status}
                        </Badge>
                        <Badge variant="secondary">
                          {formTypeLabels[invite.instance?.file?.type] || invite.instance?.file?.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{invite.email}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Sent: {new Date(invite.sent_at).toLocaleDateString()}
                        </span>
                        {invite.opened_at && (
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            Opened: {new Date(invite.opened_at).toLocaleDateString()}
                          </span>
                        )}
                        {invite.used_at && (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Submitted: {new Date(invite.used_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyLink(invite.token)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Link
                      </Button>

                      {!invite.used_at && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resendInvite(invite.id)}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Resend
                        </Button>
                      )}

                      {invite.instance?.answers?.length > 0 && (
                        <Button
                          size="sm"
                          variant="default"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Responses
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {invites.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Send className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="mb-2">No invites yet</CardTitle>
                <CardDescription className="mb-4">
                  Send forms to clients and they'll appear here
                </CardDescription>
                <Button onClick={() => setIsSendFormDialogOpen(true)}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Your First Form
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}