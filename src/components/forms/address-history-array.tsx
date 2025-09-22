import React from "react"
import { useFieldArray, Control } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus } from "lucide-react"

interface AddressEntry {
  dateFrom: string
  dateTo: string
  streetAddress: string
  city: string
  province: string
  postalCode: string
  country: string
}

interface AddressHistoryArrayProps {
  control: Control<any>
  name: string
  label: string
}

export default function AddressHistoryArray({ control, name, label }: AddressHistoryArrayProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name
  })

  const addAddress = () => {
    append({
      dateFrom: "",
      dateTo: "", 
      streetAddress: "",
      city: "",
      province: "",
      postalCode: "",
      country: ""
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">{label}</Label>
        <Button type="button" variant="outline" size="sm" onClick={addAddress}>
          <Plus className="h-4 w-4 mr-2" />
          Add Address
        </Button>
      </div>

      {fields.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No addresses added yet. Click "Add Address" to get started.</p>
        </div>
      )}

      {fields.map((field, index) => (
        <Card key={field.id}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Address #{index + 1}</CardTitle>
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
              <Label htmlFor={`${name}.${index}.streetAddress`}>Street Address *</Label>
              <Input
                id={`${name}.${index}.streetAddress`}
                placeholder="123 Main Street, Apt 4B"
                {...control.register(`${name}.${index}.streetAddress`)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`${name}.${index}.city`}>City *</Label>
                <Input
                  id={`${name}.${index}.city`}
                  placeholder="Toronto"
                  {...control.register(`${name}.${index}.city`)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${name}.${index}.province`}>Province/State *</Label>
                <Input
                  id={`${name}.${index}.province`}
                  placeholder="Ontario"
                  {...control.register(`${name}.${index}.province`)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`${name}.${index}.postalCode`}>Postal Code *</Label>
                <Input
                  id={`${name}.${index}.postalCode`}
                  placeholder="M5V 3A8"
                  {...control.register(`${name}.${index}.postalCode`)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${name}.${index}.country`}>Country *</Label>
                <Input
                  id={`${name}.${index}.country`}
                  placeholder="Canada"
                  {...control.register(`${name}.${index}.country`)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}