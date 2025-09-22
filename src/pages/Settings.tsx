import { useState, useEffect } from "react"
import { Plus, FileText, Settings as SettingsIcon, Bell, Shield, Database, Edit, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { api } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import { forms, FormType, FormTemplate } from "@/data/forms"
import FormTemplateEditor from "@/components/forms/FormTemplateEditor"
import FormRenderer from "@/components/forms/FormRenderer"

export default function Settings() {
  const [formTemplates, setFormTemplates] = useState<Array<{
    id: string
    code: string
    title: string
    description: string
    is_active: boolean
    sections: FormSection[]
    questions: FormQuestion[]
  }>>([])
  const [loading, setLoading] = useState(true)
  const [editingTemplate, setEditingTemplate] = useState<{template: FormTemplate & {id?: string, code?: string}, isNew: boolean} | null>(null)
  const [previewingTemplate, setPreviewingTemplate] = useState<{template: FormTemplate, formType: FormType} | null>(null)

  useEffect(() => {
    fetchFormTemplates()
  }, [])

  const fetchFormTemplates = async () => {
    try {
      const data = await api.getFormTemplates()
      setFormTemplates(data)
    } catch (error) {
      console.error("Error fetching form templates:", error)
      // Try to initialize templates if they don't exist
      try {
        await api.initializeFormTemplates()
        const data = await api.getFormTemplates()
        setFormTemplates(data)
        toast({
          title: "Success",
          description: "Form templates initialized successfully"
        })
      } catch (initError) {
        // Use local forms data as fallback
        const localTemplates = Object.entries(forms).map(([code, template]) => ({
          id: code,
          code,
          title: template.title,
          description: template.title,
          is_active: true,
          sections: template.sections,
          questions: template.sections.flatMap(s => s.questions)
        }))
        setFormTemplates(localTemplates)
        toast({
          title: "Info",
          description: "Using local form templates"
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleEditTemplate = (template: {
    id: string
    code: string
    title: string
    description: string
    is_active: boolean
    sections: FormSection[]
    questions: FormQuestion[]
  }) => {
    const formTemplate = forms[template.code as FormType]
    if (formTemplate) {
      setEditingTemplate({
        template: {
          ...formTemplate,
          id: template.id,
          code: template.code
        },
        isNew: false
      })
    }
  }

  const handleCreateTemplate = () => {
    setEditingTemplate({
      template: {
        title: "New Custom Form",
        sections: []
      },
      isNew: true
    })
  }

  const handleSaveTemplate = async (template: FormTemplate) => {
    try {
      // Here you would normally save to the backend
      // For now, we'll just update the local state
      toast({
        title: "Success",
        description: "Form template saved successfully"
      })
      setEditingTemplate(null)
      // You could refetch templates here if needed
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save form template",
        variant: "destructive"
      })
    }
  }

  const handlePreviewTemplate = (template: {
    id: string
    code: string
    title: string
    description: string
    is_active: boolean
    sections: FormSection[]
    questions: FormQuestion[]
  }) => {
    const formTemplate = forms[template.code as FormType]
    if (formTemplate) {
      setPreviewingTemplate({
        template: formTemplate,
        formType: template.code as FormType
      })
    }
  }

  const formTypeLabels: Record<string, string> = {
    WP: "Work Permit",
    SV: "Super Visa / Visitor",
    PR: "Permanent Residence"
  }

  const formTypeDescriptions: Record<string, string> = {
    WP: "Complete intake form for Work Permit applications including job details and LMIA information",
    SV: "Visitor and Super Visa application forms for temporary residence",
    PR: "Comprehensive forms for Permanent Residence applications through various streams"
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application settings and form templates
        </p>
      </div>

      <Tabs defaultValue="forms" className="space-y-4">
        <TabsList>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Forms Tab */}
        <TabsContent value="forms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Form Templates</CardTitle>
              <CardDescription>
                Manage your immigration form templates and their configurations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading form templates...</p>
                </div>
              ) : formTemplates.length > 0 ? (
                <div className="grid gap-4">
                  {formTemplates.map((template) => (
                    <Card key={template.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-primary" />
                              <CardTitle className="text-base">
                                {template.title}
                              </CardTitle>
                              <Badge variant="secondary">
                                {formTypeLabels[template.code]}
                              </Badge>
                              {template.is_active && (
                                <Badge className="bg-success text-success-foreground">
                                  Active
                                </Badge>
                              )}
                            </div>
                            <CardDescription>
                              {template.description || formTypeDescriptions[template.code]}
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handlePreviewTemplate(template)}>
                              <Eye className="h-4 w-4 mr-1" />
                              Preview
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleEditTemplate(template)}>
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {template.questions?.length || 0} questions
                          </span>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={template.is_active}
                                onCheckedChange={() => {
                                  toast({
                                    title: "Template updated",
                                    description: `${template.title} has been ${template.is_active ? 'deactivated' : 'activated'}`
                                  })
                                }}
                              />
                              <Label className="text-sm">Active</Label>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="text-center py-8">
                  <CardContent>
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <CardTitle className="mb-2">No form templates</CardTitle>
                    <CardDescription className="mb-4">
                      Initialize form templates to get started
                    </CardDescription>
                    <Button onClick={async () => {
                      try {
                        await api.initializeFormTemplates()
                        fetchFormTemplates()
                        toast({
                          title: "Success",
                          description: "Form templates initialized successfully"
                        })
                      } catch (error) {
                        toast({
                          title: "Error",
                          description: "Failed to initialize templates",
                          variant: "destructive"
                        })
                      }
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Initialize Templates
                    </Button>
                  </CardContent>
                </Card>
              )}

              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full" onClick={handleCreateTemplate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Custom Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure general application preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle dark mode theme
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-save</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically save changes as you work
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Compact View</Label>
                  <p className="text-sm text-muted-foreground">
                    Use a more compact layout
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates about client activities
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Form Submissions</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when clients submit forms
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Deadline Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive reminders for upcoming deadlines
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>System Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about system updates and maintenance
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and privacy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Session Timeout</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically log out after inactivity
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Login History</Label>
                  <p className="text-sm text-muted-foreground">
                    View your recent login activity
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  View History
                </Button>
              </div>

              <div className="pt-4 border-t">
                <Button variant="destructive" className="w-full">
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Form Template Editor Dialog */}
      {editingTemplate && (
        <Dialog open={!!editingTemplate} onOpenChange={() => setEditingTemplate(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate.isNew ? "Create New Form Template" : "Edit Form Template"}
              </DialogTitle>
              <DialogDescription>
                {editingTemplate.isNew
                  ? "Create a new custom form template for client intake"
                  : "Modify the form template structure and questions"
                }
              </DialogDescription>
            </DialogHeader>
            <FormTemplateEditor
              template={editingTemplate.template}
              onSave={handleSaveTemplate}
              onCancel={() => setEditingTemplate(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Form Preview Dialog */}
      {previewingTemplate && (
        <Dialog open={!!previewingTemplate} onOpenChange={() => setPreviewingTemplate(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Form Preview</DialogTitle>
              <DialogDescription>
                Preview how this form will appear to clients
              </DialogDescription>
            </DialogHeader>
            <FormRenderer
              formTemplate={previewingTemplate.template}
              formType={previewingTemplate.formType}
              clientName="John Doe (Preview)"
              onSubmit={(data) => {
                console.log("Preview form data:", data)
                toast({
                  title: "Preview Mode",
                  description: "This is a preview - no data was saved"
                })
              }}
              onSaveDraft={(data) => {
                console.log("Preview draft data:", data)
                toast({
                  title: "Preview Mode - Draft",
                  description: "This is a preview - no draft was saved"
                })
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}