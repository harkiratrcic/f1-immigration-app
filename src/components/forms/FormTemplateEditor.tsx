import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Save, X, GripVertical } from "lucide-react"
import { FormTemplate, FormSection, FormQuestion, FieldType } from "@/data/forms"
import { toast } from "@/hooks/use-toast"

interface FormTemplateEditorProps {
  template: FormTemplate & { id?: string; code?: string; is_active?: boolean }
  onSave: (template: FormTemplate) => void
  onCancel: () => void
}

const fieldTypes: { value: FieldType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "textarea", label: "Text Area" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "date", label: "Date" },
  { value: "select", label: "Select/Dropdown" },
  { value: "radio", label: "Radio Buttons" },
  { value: "checkbox", label: "Checkbox" },
  { value: "file", label: "File Upload" },
  { value: "country", label: "Country" },
]

const QuestionEditor = ({
  question,
  onUpdate,
  onDelete
}: {
  question: FormQuestion,
  onUpdate: (q: FormQuestion) => void,
  onDelete: () => void
}) => {
  const [editing, setEditing] = useState(false)
  const [editedQuestion, setEditedQuestion] = useState<FormQuestion>(question)

  const handleSave = () => {
    onUpdate(editedQuestion)
    setEditing(false)
  }

  const handleCancel = () => {
    setEditedQuestion(question)
    setEditing(false)
  }

  if (!editing) {
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{question.label}</span>
                {question.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                <Badge variant="secondary" className="text-xs">{question.type}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Key: {question.key}</p>
              {question.options && question.options.length > 0 && (
                <p className="text-sm text-muted-foreground">Options: {question.options.join(", ")}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-4 border-primary">
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              value={editedQuestion.label}
              onChange={(e) => setEditedQuestion({...editedQuestion, label: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="key">Key</Label>
            <Input
              id="key"
              value={editedQuestion.key}
              onChange={(e) => setEditedQuestion({...editedQuestion, key: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="type">Field Type</Label>
            <Select
              value={editedQuestion.type}
              onValueChange={(value) => setEditedQuestion({...editedQuestion, type: value as FieldType})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fieldTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2 mt-6">
            <Checkbox
              id="required"
              checked={editedQuestion.required || false}
              onCheckedChange={(checked) => setEditedQuestion({...editedQuestion, required: checked as boolean})}
            />
            <Label htmlFor="required">Required</Label>
          </div>
        </div>

        {(editedQuestion.type === "select" || editedQuestion.type === "radio") && (
          <div>
            <Label htmlFor="options">Options (one per line)</Label>
            <Textarea
              id="options"
              value={editedQuestion.options?.join("\n") || ""}
              onChange={(e) => setEditedQuestion({
                ...editedQuestion,
                options: e.target.value.split("\n").filter(o => o.trim())
              })}
              placeholder="Option 1&#10;Option 2&#10;Option 3"
            />
          </div>
        )}

        <div>
          <Label htmlFor="help_text">Help Text (optional)</Label>
          <Textarea
            id="help_text"
            value={editedQuestion.help_text || ""}
            onChange={(e) => setEditedQuestion({...editedQuestion, help_text: e.target.value})}
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const SectionEditor = ({
  section,
  onUpdate,
  onDelete
}: {
  section: FormSection,
  onUpdate: (s: FormSection) => void,
  onDelete: () => void
}) => {
  const [editedSection, setEditedSection] = useState<FormSection>(section)

  const addQuestion = () => {
    const newQuestion: FormQuestion = {
      key: `new_question_${Date.now()}`,
      label: "New Question",
      type: "text",
      required: false
    }

    setEditedSection({
      ...editedSection,
      questions: [...editedSection.questions, newQuestion]
    })
  }

  const updateQuestion = (index: number, question: FormQuestion) => {
    const updatedQuestions = [...editedSection.questions]
    updatedQuestions[index] = question
    setEditedSection({
      ...editedSection,
      questions: updatedQuestions
    })
    onUpdate({
      ...editedSection,
      questions: updatedQuestions
    })
  }

  const deleteQuestion = (index: number) => {
    const updatedQuestions = editedSection.questions.filter((_, i) => i !== index)
    setEditedSection({
      ...editedSection,
      questions: updatedQuestions
    })
    onUpdate({
      ...editedSection,
      questions: updatedQuestions
    })
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Input
              value={editedSection.title}
              onChange={(e) => {
                const updated = {...editedSection, title: e.target.value}
                setEditedSection(updated)
                onUpdate(updated)
              }}
              className="text-lg font-semibold"
            />
          </div>
          <Button variant="outline" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {editedSection.questions.map((question, index) => (
          <QuestionEditor
            key={`${question.key}-${index}`}
            question={question}
            onUpdate={(q) => updateQuestion(index, q)}
            onDelete={() => deleteQuestion(index)}
          />
        ))}

        <Button variant="outline" onClick={addQuestion} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </CardContent>
    </Card>
  )
}

export default function FormTemplateEditor({ template, onSave, onCancel }: FormTemplateEditorProps) {
  const [editedTemplate, setEditedTemplate] = useState<FormTemplate>(template)

  const addSection = () => {
    const newSection: FormSection = {
      id: `section_${Date.now()}`,
      title: "New Section",
      questions: []
    }

    setEditedTemplate({
      ...editedTemplate,
      sections: [...editedTemplate.sections, newSection]
    })
  }

  const updateSection = (index: number, section: FormSection) => {
    const updatedSections = [...editedTemplate.sections]
    updatedSections[index] = section
    setEditedTemplate({
      ...editedTemplate,
      sections: updatedSections
    })
  }

  const deleteSection = (index: number) => {
    const updatedSections = editedTemplate.sections.filter((_, i) => i !== index)
    setEditedTemplate({
      ...editedTemplate,
      sections: updatedSections
    })
  }

  const handleSave = () => {
    if (!editedTemplate.title.trim()) {
      toast({
        title: "Error",
        description: "Please provide a title for the form template",
        variant: "destructive"
      })
      return
    }

    if (editedTemplate.sections.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one section to the form template",
        variant: "destructive"
      })
      return
    }

    onSave(editedTemplate)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <Label htmlFor="title">Form Title</Label>
          <Input
            id="title"
            value={editedTemplate.title}
            onChange={(e) => setEditedTemplate({...editedTemplate, title: e.target.value})}
            className="text-xl font-semibold"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Template
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {editedTemplate.sections.map((section, index) => (
          <SectionEditor
            key={`${section.id}-${index}`}
            section={section}
            onUpdate={(s) => updateSection(index, s)}
            onDelete={() => deleteSection(index)}
          />
        ))}

        <Button variant="outline" onClick={addSection} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </div>
    </div>
  )
}