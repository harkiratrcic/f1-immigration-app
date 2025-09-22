import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Mail, Phone, Globe, User, Calendar, Send, Eye, CheckCircle, Clock, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { api } from "@/lib/api"
import { toast } from "@/hooks/use-toast"

export default function ClientDetail() {
  const { clientId } = useParams<{ clientId: string }>()
  const navigate = useNavigate()
  const [client, setClient] = useState<any>(null)
  const [invites, setInvites] = useState<any[]>([])
  const [formResponses, setFormResponses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedResponse, setSelectedResponse] = useState<any>(null)
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false)

  useEffect(() => {
    if (clientId) {
      fetchClientDetails()
      fetchClientInvites()
      fetchClientResponses()
    }
  }, [clientId])

  const fetchClientDetails = async () => {
    try {
      const data = await api.getClient(clientId!)
      setClient(data)
    } catch (error) {
      console.error("Error fetching client:", error)
      toast({
        title: "Error",
        description: "Failed to fetch client details",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchClientInvites = async () => {
    try {
      const data = await api.getClientInvites(clientId!)
      setInvites(data)
    } catch (error) {
      console.error("Error fetching invites:", error)
    }
  }

  const fetchClientResponses = async () => {
    try {
      const data = await api.getClientResponses(clientId!)
      setFormResponses(data)
    } catch (error) {
      console.error("Error fetching form responses:", error)
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
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || "??"
  }

  const copyLink = (token: string) => {
    const link = `${window.location.origin}/form/${token}`
    navigator.clipboard.writeText(link)
    toast({
      title: "Link copied!",
      description: "Form link has been copied to clipboard."
    })
  }

  const viewFormResponse = async (invite: any) => {
    try {
      const response = await api.getFormInstance(invite.instance_id)
      setSelectedResponse(response)
      setIsResponseDialogOpen(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch form response",
        variant: "destructive"
      })
    }
  }

  const formatAnswerValue = (value: any) => {
    if (typeof value === 'object') {
      return JSON.stringify(value)
    }
    return value?.toString() || 'No answer'
  }

  const formTypeLabels: Record<string, string> = {
    WORK_PERMIT: "Work Permit",
    VISITOR_SUPERVISA: "Visitor/Super Visa",
    PERMANENT_RESIDENCE: "Permanent Residence"
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Client not found</h1>
          <Button onClick={() => navigate("/clients")} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clients
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate("/clients")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Client Details</h1>
          <p className="text-muted-foreground">
            View client information and form submissions
          </p>
        </div>
      </div>

      {/* Client Information */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {getInitials(client.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl">{client.full_name}</CardTitle>
              <CardDescription className="text-base mt-1">
                Client since {new Date(client.created_at).toLocaleDateString()}
              </CardDescription>
              {client.uci && (
                <Badge variant="secondary" className="mt-2">
                  UCI: {client.uci}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{client.primary_email}</span>
            </div>
            {client.phone_number && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{client.phone_number}</span>
              </div>
            )}
            {client.current_country && (
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>{client.current_country}</span>
              </div>
            )}
            {client.date_of_birth && (
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(client.date_of_birth).toLocaleDateString()}</span>
              </div>
            )}
          </div>
          {client.notes && (
            <div>
              <h4 className="font-medium mb-2">Notes</h4>
              <p className="text-sm text-muted-foreground">{client.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Forms and Invites */}
      <Tabs defaultValue="submitted" className="space-y-4">
        <TabsList>
          <TabsTrigger value="submitted">Submitted Forms ({formResponses.filter(r => r.status === 'SUBMITTED').length})</TabsTrigger>
          <TabsTrigger value="forms">All Forms ({invites.length})</TabsTrigger>
          <TabsTrigger value="files">Files ({client.files?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="submitted" className="space-y-4">
          {formResponses.filter(r => r.status === 'SUBMITTED').length > 0 ? (
            <div className="grid gap-6">
              {formResponses.filter(r => r.status === 'SUBMITTED').map((response) => (
                <Card key={response.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">
                          {response.formTemplate?.title || "Form Response"}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Submitted: {new Date(response.updatedAt || response.createdAt).toLocaleDateString()}
                          </span>
                          <Badge variant="secondary">
                            {formTypeLabels[response.fileType] || response.fileType}
                          </Badge>
                        </CardDescription>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedResponse(response)
                          setIsResponseDialogOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Key Information</h4>
                      <div className="grid gap-3 md:grid-cols-2">
                        {response.answers?.slice(0, 6).map((answer: any) => {
                          const question = response.formTemplate?.questions?.find((q: any) => q.key === answer.question_key)
                          if (!question) return null
                          return (
                            <div key={answer.id} className="space-y-1">
                              <label className="text-sm font-medium text-muted-foreground">
                                {question.label}
                              </label>
                              <p className="text-sm font-medium">
                                {formatAnswerValue(answer.value)}
                              </p>
                            </div>
                          )
                        })}
                      </div>
                      {response.answers?.length > 6 && (
                        <p className="text-sm text-muted-foreground italic">
                          +{response.answers.length - 6} more fields submitted
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="mb-2">No submitted forms yet</CardTitle>
                <CardDescription>
                  Submitted forms will appear here once the client completes them
                </CardDescription>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="forms" className="space-y-4">
          {invites.length > 0 ? (
            <div className="grid gap-4">
              {invites.map((invite) => (
                <Card key={invite.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">
                            {invite.instance?.template?.title || "Unknown Form"}
                          </h3>
                          <Badge className={getStatusColor(invite.instance?.status)}>
                            {invite.instance?.status}
                          </Badge>
                          <Badge variant="secondary">
                            {formTypeLabels[invite.instance?.file?.type] || invite.instance?.file?.type}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Send className="h-3 w-3" />
                            Sent: {new Date(invite.sent_at).toLocaleDateString()}
                          </div>
                          {invite.opened_at && (
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              Opened: {new Date(invite.opened_at).toLocaleDateString()}
                            </div>
                          )}
                          {invite.used_at && (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Submitted: {new Date(invite.used_at).toLocaleDateString()}
                            </div>
                          )}
                          {!invite.opened_at && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Not opened yet
                            </div>
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

                        {invite.instance?.status === 'SUBMITTED' && (
                          <Button
                            size="sm"
                            onClick={() => viewFormResponse(invite)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Response
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Send className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="mb-2">No forms sent yet</CardTitle>
                <CardDescription>
                  Send forms to this client and they'll appear here
                </CardDescription>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="files" className="space-y-4">
          <Card className="text-center py-12">
            <CardContent>
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="mb-2">Files coming soon</CardTitle>
              <CardDescription>
                Immigration files and documents will be shown here
              </CardDescription>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Form Response Dialog */}
      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Form Response</DialogTitle>
            <DialogDescription>
              {selectedResponse?.template?.title} - Submitted by {client.full_name}
            </DialogDescription>
          </DialogHeader>

          {selectedResponse && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium">Form Details</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Form: {selectedResponse.formTemplate?.title || selectedResponse.template?.title}</p>
                    <p>Status: {selectedResponse.status}</p>
                    <p>Submitted: {(selectedResponse.updatedAt || selectedResponse.updated_at) ? new Date(selectedResponse.updatedAt || selectedResponse.updated_at).toLocaleString() : 'Not submitted'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Form Responses</h4>
                <div className="space-y-4">
                  {(selectedResponse.formTemplate?.questions || selectedResponse.template?.questions)?.map((question: any) => {
                    const answer = selectedResponse.answers?.find((a: any) => a.question_key === question.key)
                    return (
                      <div key={question.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <label className="font-medium">{question.label}</label>
                          {question.required && <Badge variant="secondary">Required</Badge>}
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          Type: {question.type}
                        </div>
                        <div className="bg-muted p-3 rounded">
                          <strong>Answer: </strong>
                          {answer ? formatAnswerValue(answer.value) : 'No answer provided'}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}