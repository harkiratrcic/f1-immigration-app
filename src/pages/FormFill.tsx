import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, FileText } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { forms, FormType } from "@/data/forms"
import FormRenderer from "@/components/forms/FormRenderer"

// Mock client data with saved form data - replace with actual API calls
const mockClients = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    formType: "WP" as FormType,
    token: "work-permit-demo",
    createdAt: new Date("2024-01-15"),
    savedData: null,
    isSubmitted: false,
    lastSaved: null
  },
  {
    id: "2",
    name: "Maria Garcia",
    email: "maria@example.com",
    formType: "PR" as FormType,
    token: "pr-demo",
    createdAt: new Date("2024-01-10"),
    savedData: null,
    isSubmitted: true,
    lastSaved: new Date("2024-01-10")
  },
  {
    id: "3",
    name: "Sarah Chen",
    email: "sarah@example.com",
    formType: "SV" as FormType,
    token: "visitor-visa-demo",
    createdAt: new Date("2024-01-12"),
    savedData: null,
    isSubmitted: true,
    lastSaved: new Date("2024-01-12")
  },
  {
    id: "4",
    name: "Ahmed Hassan",
    email: "ahmed@example.com",
    formType: "WP" as FormType,
    token: "abc123def456",
    createdAt: new Date("2024-01-20"),
    savedData: null,
    isSubmitted: false,
    lastSaved: null
  },
  {
    id: "5",
    name: "Elena Rodriguez",
    email: "elena@example.com",
    formType: "SV" as FormType,
    token: "xyz789uvw012",
    createdAt: new Date("2024-01-18"),
    savedData: null,
    isSubmitted: false,
    lastSaved: null
  }
]

// Simple in-memory storage for demo purposes with sample data
const formDataStorage: Record<string, any> = {
  "2": {
    // Sample PR application data for Maria Garcia
    full_legal_name: "Maria Elena Garcia Rodriguez",
    date_of_birth: "1985-03-15",
    place_of_birth: "Mexico City, Mexico",
    citizenship: "Mexican",
    gender: "Female",
    marital_status: "Married",
    current_address: "123 Maple Street, Apt 4B\nToronto, ON M5V 2A1\nCanada",
    contact_details: "Phone: +1-416-555-0123\nEmail: maria.garcia@email.com",
    spouse_partner: "Carlos Rodriguez Garcia, DOB: 1983-07-22, Born: Guadalajara, Mexico, Citizen: Mexican",
    marital_status_date: "Married on June 15, 2010",
    passport_details: "Passport: G12345678, Mexico, Issued: 2020-01-15, Expires: 2030-01-14",
    been_to_canada: "Yes",
    canada_visit_details: "Visited as tourist in 2019 for 2 weeks, visitor visa",
    held_permits: "No",
    deportation: "No",
    current_country_status: "Temporary resident in Canada with valid work permit",
    highest_education: "Bachelor's Degree",
    educational_institutions: "Universidad Nacional Autónoma de México (UNAM)\nBachelor of Computer Science\n2003-2007",
    language_proficiency: "IELTS taken on 2023-10-15, Overall: 8.0 (Reading: 8.5, Writing: 7.5, Speaking: 8.0, Listening: 8.0)",
    pr_stream: "Canadian Experience Class",
    arranged_employment_details: "Yes",
    family_in_canada: "No",
    minimum_requirements: "Yes",
    proof_of_funds: "$25,000 CAD in savings, bank statements from TD Canada Trust",
    source_of_funds: "Employment savings and family gift",
    criminal_convictions: "No",
    inadmissibility: "No",
    immigration_violations: "No",
    ongoing_investigations: "No",
    security_terrorism: "No",
    dependent_medical_issues: "No",
    reasons_applying: "I want to build my future in Canada with my family. I love the multicultural environment and opportunities for growth in my field.",
    information_true: true,
    understanding_obligations: true,
    applicant_signature: "Maria Elena Garcia Rodriguez",
    signature_date: "2024-01-10",
    consent_verification: true,
    address_history: [
      {
        dateFrom: "2020-01-01",
        dateTo: "2024-01-10",
        streetAddress: "123 Maple Street, Apt 4B",
        city: "Toronto",
        province: "Ontario",
        postalCode: "M5V 2A1",
        country: "Canada"
      },
      {
        dateFrom: "2015-06-01",
        dateTo: "2019-12-31",
        streetAddress: "Av. Insurgentes Sur 1234, Col. Del Valle",
        city: "Mexico City",
        province: "CDMX",
        postalCode: "03100",
        country: "Mexico"
      }
    ],
    work_history: [
      {
        dateFrom: "2021-03-01",
        dateTo: "2024-01-10",
        jobTitle: "Senior Software Developer",
        employerName: "TechCorp Canada Inc.",
        employerAddress: "456 Bay Street, Suite 1200",
        employerCity: "Toronto",
        employerProvince: "Ontario",
        employerCountry: "Canada"
      },
      {
        dateFrom: "2018-01-15",
        dateTo: "2021-02-28",
        jobTitle: "Software Developer",
        employerName: "Sistemas Avanzados S.A.",
        employerAddress: "Polanco Business Center, Piso 8",
        employerCity: "Mexico City",
        employerProvince: "CDMX",
        employerCountry: "Mexico"
      }
    ]
  },
  "3": {
    // Sample Visitor Visa data for Sarah Chen
    full_legal_name: "Sarah Chen Wei",
    date_of_birth: "1990-08-25",
    place_of_birth: "Shanghai, China",
    current_citizenship: "Chinese",
    gender: "Female",
    marital_status: "Single",
    current_address: "Unit 15, Building 3, Huaihai Road\nShanghai 200021\nChina",
    primary_email: "sarah.chen@email.com",
    telephone_numbers: "+86-138-0013-8000",
    passport_number: "E12345678",
    issuing_country: "China",
    passport_issue_date: "2022-05-01",
    passport_expiry_date: "2032-04-30",
    previous_passports: "No",
    trip_purpose: "Tourism",
    intended_arrival: "2024-06-15",
    length_of_stay: "3 weeks",
    plans_to_stay_longer: "No",
    extend_past_6_months: "No",
    visited_canada_before: "No",
    visa_refusals: "No",
    other_countries_travel: "Yes",
    travel_details: "USA (2019, 2022), Japan (2021), South Korea (2023)",
    employment_status: "Employed",
    employer_details: "Shanghai Digital Solutions Ltd.\nSoftware Engineer\n2019-present\n1588 Nanjing Road, Shanghai",
    income: "¥180,000 per year",
    sufficient_funds: "Yes",
    refugee_status: "No",
    criminal_convictions: "No",
    refused_entry: "No",
    military_service: "No",
    criminal_proceedings: "No",
    disease_risk: "No",
    terrorism_involvement: "No",
    immigration_violations: "No",
    information_true: true,
    consent_collection: true,
    applicant_signature: "Sarah Chen Wei",
    signature_date: "2024-01-12"
  }
}


export default function FormFill() {
  const { token } = useParams()
  const [client, setClient] = useState<{
    id: string
    name: string
    email: string
    formType: FormType
    token: string
    createdAt: Date
    savedData: Record<string, unknown> | null
    isSubmitted: boolean
    lastSaved: Date | null
  } | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)

  // Find client by token and load saved data
  useEffect(() => {
    const foundClient = mockClients.find(c => c.token === token)
    if (foundClient) {
      // Load saved data from storage
      const savedData = formDataStorage[foundClient.id] || null
      const clientWithData = {
        ...foundClient,
        savedData,
        lastSaved: savedData ? new Date() : null
      }
      setClient(clientWithData)
      setSubmitted(foundClient.isSubmitted)
    } else {
      setClient(null)
    }
    setLoading(false)
  }, [token])


  const onSubmit = async (data: Record<string, unknown>) => {
    try {
      // Save data to storage
      if (client) {
        formDataStorage[client.id] = data

        // Update client's submission status
        const clientIndex = mockClients.findIndex(c => c.id === client.id)
        if (clientIndex !== -1) {
          mockClients[clientIndex].isSubmitted = true
          mockClients[clientIndex].savedData = data
        }
      }

      console.log("Final submission:", { clientId: client?.id, data })

      toast({
        title: "Form submitted successfully!",
        description: "Your information has been received.",
      })

      setSubmitted(true)
    } catch (error) {
      toast({
        title: "Error submitting form",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const onSaveDraft = async (data: Record<string, unknown>) => {
    try {
      // Save draft data to storage
      if (client) {
        formDataStorage[client.id] = data

        // Update client's saved data
        const updatedClient = {
          ...client,
          savedData: data,
          lastSaved: new Date()
        }
        setClient(updatedClient)
      }

      console.log("Draft saved:", { clientId: client?.id, data })

      toast({
        title: "Draft saved successfully!",
        description: "Your progress has been saved. You can continue later.",
      })
    } catch (error) {
      toast({
        title: "Error saving draft",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading form...</p>
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-xl font-semibold mb-2">Invalid Link</h1>
            <p className="text-muted-foreground mb-4">
              This form link is invalid or has expired. Please contact your immigration consultant for a new link.
            </p>

            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <h3 className="font-medium mb-2">Demo Form Links (for testing):</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Work Permit:</strong>{" "}
                  <a href="/form/work-permit-demo" className="text-primary hover:underline">
                    /form/work-permit-demo
                  </a>
                </div>
                <div>
                  <strong>Visitor/Super Visa:</strong>{" "}
                  <a href="/form/visitor-visa-demo" className="text-primary hover:underline">
                    /form/visitor-visa-demo
                  </a>
                </div>
                <div>
                  <strong>Permanent Residence:</strong>{" "}
                  <a href="/form/pr-demo" className="text-primary hover:underline">
                    /form/pr-demo
                  </a>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Need help? Email us at <a href="mailto:support@example.com" className="text-primary hover:underline">support@example.com</a>
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
            <h1 className="text-xl font-semibold mb-2">Thank You!</h1>
            <p className="text-muted-foreground mb-4">
              Your form has been submitted successfully. We will review your information and contact you soon.
            </p>
            <p className="text-sm text-muted-foreground">
              Reference: {client.token.toUpperCase()}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formTemplate = forms[client.formType]

  return (
    <FormRenderer
      formTemplate={formTemplate}
      formType={client.formType}
      clientName={client.name}
      onSubmit={onSubmit}
      onSaveDraft={onSaveDraft}
      loading={loading}
      initialData={client.savedData}
      lastSaved={client.lastSaved}
      isSubmitted={submitted}
    />
  )
}