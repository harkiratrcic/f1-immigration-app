import { useState } from "react"
import { useForm, Control } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { FormTemplate, FormQuestion, FormType } from "@/data/forms"
import AddressHistoryArray from "@/components/forms/address-history-array"
import WorkHistoryArray from "@/components/forms/work-history-array"
import { toast } from "@/hooks/use-toast"

interface FormRendererProps {
  formTemplate: FormTemplate
  formType: FormType
  onSubmit: (data: Record<string, unknown>) => void
  onSaveDraft?: (data: Record<string, unknown>) => void
  clientName?: string
  loading?: boolean
  initialData?: Record<string, unknown> | null
  lastSaved?: Date | null
  isSubmitted?: boolean
}

const createFormSchema = (template: FormTemplate, isDraft = false) => {
  const schemaFields: Record<string, z.ZodTypeAny> = {}

  template.sections.forEach(section => {
    section.questions.forEach(question => {
      if (question.type === "address_array") {
        // For arrays, make individual fields optional in draft mode
        if (isDraft) {
          schemaFields[question.key] = z.array(z.object({
            dateFrom: z.string().optional(),
            dateTo: z.string().optional(),
            streetAddress: z.string().optional(),
            city: z.string().optional(),
            province: z.string().optional(),
            postalCode: z.string().optional(),
            country: z.string().optional()
          })).optional()
        } else {
          schemaFields[question.key] = z.array(z.object({
            dateFrom: z.string().min(1, "Date from is required"),
            dateTo: z.string().min(1, "Date to is required"),
            streetAddress: z.string().min(1, "Street address is required"),
            city: z.string().min(1, "City is required"),
            province: z.string().min(1, "Province is required"),
            postalCode: z.string().min(1, "Postal code is required"),
            country: z.string().min(1, "Country is required")
          })).optional()
        }
      } else if (question.type === "work_array") {
        // For work arrays, make individual fields optional in draft mode
        if (isDraft) {
          schemaFields[question.key] = z.array(z.object({
            dateFrom: z.string().optional(),
            dateTo: z.string().optional(),
            jobTitle: z.string().optional(),
            employerName: z.string().optional(),
            employerAddress: z.string().optional(),
            employerCity: z.string().optional(),
            employerProvince: z.string().optional(),
            employerCountry: z.string().optional()
          })).optional()
        } else {
          schemaFields[question.key] = z.array(z.object({
            dateFrom: z.string().min(1, "Date from is required"),
            dateTo: z.string().min(1, "Date to is required"),
            jobTitle: z.string().min(1, "Job title is required"),
            employerName: z.string().min(1, "Employer name is required"),
            employerAddress: z.string().min(1, "Employer address is required"),
            employerCity: z.string().min(1, "Employer city is required"),
            employerProvince: z.string().min(1, "Employer province is required"),
            employerCountry: z.string().min(1, "Employer country is required")
          })).optional()
        }
      } else if (question.required && !isDraft) {
        // Only enforce required fields for final submission, not drafts
        if (question.type === "email") {
          schemaFields[question.key] = z.string().email(`Valid ${question.label} is required`)
        } else if (question.type === "checkbox") {
          schemaFields[question.key] = z.boolean().refine(val => val === true, {
            message: `${question.label} must be checked`
          })
        } else {
          schemaFields[question.key] = z.string().min(1, `${question.label} is required`)
        }
      } else {
        // All fields are optional for drafts or non-required fields
        if (question.type === "checkbox") {
          schemaFields[question.key] = z.boolean().optional()
        } else if (question.type === "email") {
          schemaFields[question.key] = z.string().email("Valid email format required").optional().or(z.literal(""))
        } else {
          schemaFields[question.key] = z.string().optional()
        }
      }
    })
  })

  return z.object(schemaFields)
}

const FormField = ({
  question,
  control,
  watch,
  register
}: {
  question: FormQuestion
  control: Control<Record<string, unknown>>
  watch: (name: string) => unknown
  register: (name: string) => Record<string, unknown>
}) => {
  const fieldValue = watch(question.key)

  // Check if field should be shown based on conditional logic
  if (question.conditional) {
    const conditionValue = watch(question.conditional.when)
    if (conditionValue !== question.conditional.eq) {
      return null
    }
  }

  const renderInput = () => {
    switch (question.type) {
      case "text":
      case "country":
        return (
          <Input
            id={question.key}
            type="text"
            {...register(question.key)}
          />
        )

      case "email":
        return (
          <Input
            id={question.key}
            type="email"
            {...register(question.key)}
          />
        )

      case "phone":
        return (
          <Input
            id={question.key}
            type="tel"
            {...register(question.key)}
          />
        )

      case "date":
        return (
          <Input
            id={question.key}
            type="date"
            {...register(question.key)}
          />
        )

      case "textarea":
        return (
          <Textarea
            id={question.key}
            rows={3}
            {...register(question.key)}
          />
        )

      case "select":
        return (
          <Select onValueChange={(value) => control.setValue(question.key, value)}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${question.label}`} />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "radio":
        return (
          <RadioGroup
            onValueChange={(value) => control.setValue(question.key, value)}
            value={fieldValue || ""}
          >
            {question.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.key}-${option}`} />
                <Label htmlFor={`${question.key}-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={question.key}
              checked={fieldValue || false}
              onCheckedChange={(checked) => control.setValue(question.key, checked)}
            />
            <Label htmlFor={question.key} className="text-sm font-normal">
              {question.label}
            </Label>
          </div>
        )

      case "file":
        return (
          <Input
            id={question.key}
            type="file"
            {...register(question.key)}
          />
        )

      case "address_array":
        return (
          <AddressHistoryArray
            control={control}
            name={question.key}
            label={question.label}
          />
        )

      case "work_array":
        return (
          <WorkHistoryArray
            control={control}
            name={question.key}
            label={question.label}
          />
        )

      default:
        return (
          <Input
            id={question.key}
            type="text"
            {...register(question.key)}
          />
        )
    }
  }

  if (question.type === "checkbox") {
    return (
      <div className="space-y-2">
        {renderInput()}
        {question.help_text && (
          <p className="text-sm text-muted-foreground">{question.help_text}</p>
        )}
      </div>
    )
  }

  if (question.type === "address_array" || question.type === "work_array") {
    return (
      <div className="space-y-2">
        {renderInput()}
        {question.help_text && (
          <p className="text-sm text-muted-foreground">{question.help_text}</p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={question.key}>
        {question.label} {question.required && <span className="text-destructive">*</span>}
      </Label>
      {renderInput()}
      {question.help_text && (
        <p className="text-sm text-muted-foreground">{question.help_text}</p>
      )}
    </div>
  )
}

export default function FormRenderer({
  formTemplate,
  formType,
  onSubmit,
  onSaveDraft,
  clientName,
  loading,
  initialData,
  lastSaved,
  isSubmitted
}: FormRendererProps) {
  // Create default values for array fields and merge with initial data
  const defaultValues: Record<string, unknown> = {}
  formTemplate.sections.forEach(section => {
    section.questions.forEach(question => {
      if (question.type === "address_array" || question.type === "work_array") {
        defaultValues[question.key] = []
      }
    })
  })

  // Merge initial data if available
  const finalDefaultValues = initialData ? { ...defaultValues, ...initialData } : defaultValues

  const form = useForm({
    resolver: zodResolver(createFormSchema(formTemplate, true)), // Use draft mode for validation
    defaultValues: finalDefaultValues,
    mode: "onChange" // Validate on change for better UX
  })

  const handleSaveDraft = () => {
    if (onSaveDraft) {
      const currentData = form.getValues()
      onSaveDraft(currentData)
    }
  }

  const handleFinalSubmit = async (data: Record<string, unknown>) => {
    try {
      // Validate with strict schema before final submission
      const strictSchema = createFormSchema(formTemplate, false)
      const validatedData = strictSchema.parse(data)
      onSubmit(validatedData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Set form errors for strict validation
        error.errors.forEach((err) => {
          if (err.path) {
            form.setError(err.path.join('.') as any, {
              type: 'manual',
              message: err.message
            })
          }
        })

        toast({
          title: "Please complete required fields",
          description: "Some required fields are missing or invalid. Please check the form and try again.",
          variant: "destructive"
        })
      }
    }
  }

  const formTypeNames = {
    WP: "Work Permit",
    SV: "Visitor/Super Visa",
    PR: "Permanent Residence"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              {formTemplate.title}
            </CardTitle>
            {clientName && (
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">
                  Hello {clientName}, please complete the form below
                </p>
                {lastSaved && (
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-muted-foreground">
                      Last saved: {lastSaved.toLocaleDateString()} at {lastSaved.toLocaleTimeString()}
                    </span>
                  </div>
                )}
                {isSubmitted && (
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-blue-600 font-medium">
                      Form submitted - You can still update your information
                    </span>
                  </div>
                )}
              </div>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(handleFinalSubmit)} className="space-y-6">
              <Accordion type="single" collapsible className="w-full">
                {formTemplate.sections.map((section, index) => (
                  <AccordionItem key={section.id} value={section.id}>
                    <AccordionTrigger className="text-left">
                      {section.title}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      {section.questions.map((question) => (
                        <FormField
                          key={question.key}
                          question={question}
                          control={form.control}
                          watch={form.watch}
                          register={form.register}
                        />
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="pt-6 border-t space-y-4">
                {onSaveDraft && (
                  <div className="flex items-center justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSaveDraft}
                      disabled={loading}
                      className="w-full max-w-md"
                    >
                      💾 Save as Draft
                    </Button>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={form.formState.isSubmitting || loading}
                    size="lg"
                  >
                    {form.formState.isSubmitting || loading ? "Submitting..." : isSubmitted ? "Update Submission" : "Submit Form"}
                  </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  <p>💡 You can save your progress as a draft and continue later</p>
                  <p>All your information will be preserved when you return</p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}