import React from "react"
import { useFieldArray, Control } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus } from "lucide-react"

interface WorkEntry {
  dateFrom: string
  dateTo: string
  jobTitle: string
  employerName: string
  employerAddress: string
  employerCity: string
  employerProvince: string
  employerCountry: string
}

interface WorkHistoryArrayProps {
  control: Control<any>
  name: string
  label: string
}

export default function WorkHistoryArray({ control, name, label }: WorkHistoryArrayProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name
  })

  const addWorkExperience = () => {
    append({
      dateFrom: "",
      dateTo: "",
      jobTitle: "",
      employerName: "",
      employerAddress: "",
      employerCity: "",
      employerProvince: "",
      employerCountry: ""
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">{label}</Label>
        <Button type="button" variant="outline" size="sm" onClick={addWorkExperience}>
          <Plus className="h-4 w-4 mr-2" />
          Add Work Experience
        </Button>
      </div>

      {fields.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No work experience added yet. Click "Add Work Experience" to get started.</p>
        </div>
      )}

      {fields.map((field, index) => (
        <Card key={field.id}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Work Experience #{index + 1}</CardTitle>
              {fields.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`${name}.${index}.dateFrom`}>Date From *</Label>
                <Input
                  id={`${name}.${index}.dateFrom`}
                  type="date"
                  {...control.register(`${name}.${index}.dateFrom`)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${name}.${index}.dateTo`}>Date To *</Label>
                <Input
                  id={`${name}.${index}.dateTo`}
                  type="date"
                  {...control.register(`${name}.${index}.dateTo`)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${name}.${index}.jobTitle`}>Job Title *</Label>
              <Input
                id={`${name}.${index}.jobTitle`}
                placeholder="Software Developer"
                {...control.register(`${name}.${index}.jobTitle`)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${name}.${index}.employerName`}>Employer Name *</Label>
              <Input
                id={`${name}.${index}.employerName`}
                placeholder="ABC Corporation"
                {...control.register(`${name}.${index}.employerName`)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${name}.${index}.employerAddress`}>Employer Address *</Label>
              <Input
                id={`${name}.${index}.employerAddress`}
                placeholder="456 Business Ave, Suite 100"
                {...control.register(`${name}.${index}.employerAddress`)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`${name}.${index}.employerCity`}>Employer City *</Label>
                <Input
                  id={`${name}.${index}.employerCity`}
                  placeholder="Vancouver"
                  {...control.register(`${name}.${index}.employerCity`)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${name}.${index}.employerProvince`}>Employer Province/State *</Label>
                <Input
                  id={`${name}.${index}.employerProvince`}
                  placeholder="British Columbia"
                  {...control.register(`${name}.${index}.employerProvince`)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${name}.${index}.employerCountry`}>Employer Country *</Label>
              <Input
                id={`${name}.${index}.employerCountry`}
                placeholder="Canada"
                {...control.register(`${name}.${index}.employerCountry`)}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}