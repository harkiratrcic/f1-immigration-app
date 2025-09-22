import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowLeft, CheckCircle, Clock, User, MapPin, Briefcase, FileText } from "lucide-react"
import { forms, FormType } from "@/data/forms"

// Import shared storage and mock clients from FormFill
// In production, this would be an API call to fetch data
const getFormData = (clientId: string) => {
  // This simulates fetching from the same storage that FormFill uses
  return {
    "2": {
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
  }[clientId] || null
}

const mockClients = [
  {
    id: "2",
    name: "Maria Garcia",
    email: "maria@example.com",
    formType: "PR" as FormType,
    token: "pr-demo",
    submitted: true,
    submittedAt: new Date("2024-01-10")
  },
  {
    id: "3",
    name: "Sarah Chen",
    email: "sarah@example.com",
    formType: "SV" as FormType,
    token: "visitor-visa-demo",
    submitted: true,
    submittedAt: new Date("2024-01-12")
  }
]

export default function AdminResponses() {
  const { clientId } = useParams()
  const [client, setClient] = useState<any>(null)
  const [formData, setFormData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock API calls
    const foundClient = mockClients.find(c => c.id === clientId)
    const clientFormData = getFormData(clientId || "")

    setClient(foundClient)
    setFormData(clientFormData)
    setLoading(false)
  }, [clientId])

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Client not found</h3>
            <p className="text-muted-foreground mb-4">The requested client could not be found.</p>
            <Link to="/admin/clients">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Clients
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formTypeNames = {
    WP: "Work Permit",
    SV: "Visitor/Super Visa", 
    PR: "Permanent Residence"
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/clients">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Responses for {client.name}</h1>
          <p className="text-muted-foreground">{client.email} • {formTypeNames[client.formType as keyof typeof formTypeNames]}</p>
        </div>
      </div>

      {!formData ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No response yet</h3>
            <p className="text-muted-foreground">
              This client hasn't submitted their form yet. Share the form link to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Submitted Application
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Submitted
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {client.submittedAt?.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full">
                {/* Personal Information Section */}
                <AccordionItem value="personal-info">
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Personal Information
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.full_legal_name && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Full Legal Name</Label>
                          <p className="text-sm mt-1">{formData.full_legal_name}</p>
                        </div>
                      )}
                      {formData.date_of_birth && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Date of Birth</Label>
                          <p className="text-sm mt-1">{formData.date_of_birth}</p>
                        </div>
                      )}
                      {formData.place_of_birth && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Place of Birth</Label>
                          <p className="text-sm mt-1">{formData.place_of_birth}</p>
                        </div>
                      )}
                      {(formData.citizenship || formData.current_citizenship) && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Citizenship</Label>
                          <p className="text-sm mt-1">{formData.citizenship || formData.current_citizenship}</p>
                        </div>
                      )}
                      {formData.gender && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Gender</Label>
                          <p className="text-sm mt-1">{formData.gender}</p>
                        </div>
                      )}
                      {formData.marital_status && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Marital Status</Label>
                          <p className="text-sm mt-1">{formData.marital_status}</p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Contact Information Section */}
                <AccordionItem value="contact-info">
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Contact Information
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    {formData.current_address && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Current Address</Label>
                        <pre className="text-sm mt-1 whitespace-pre-wrap bg-muted p-3 rounded">{formData.current_address}</pre>
                      </div>
                    )}
                    {(formData.contact_details || formData.primary_email || formData.telephone_numbers) && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Contact Details</Label>
                        <div className="text-sm mt-1">
                          {formData.contact_details && <pre className="whitespace-pre-wrap bg-muted p-3 rounded">{formData.contact_details}</pre>}
                          {formData.primary_email && <p>Email: {formData.primary_email}</p>}
                          {formData.telephone_numbers && <p>Phone: {formData.telephone_numbers}</p>}
                        </div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>

                {/* Address History Section */}
                {formData.address_history && Array.isArray(formData.address_history) && formData.address_history.length > 0 && (
                  <AccordionItem value="address-history">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Address History ({formData.address_history.length} entries)
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      {formData.address_history.map((address: any, index: number) => (
                        <Card key={index} className="bg-muted/50">
                          <CardContent className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs font-medium text-muted-foreground">Period</Label>
                                <p className="text-sm">{address.dateFrom} to {address.dateTo}</p>
                              </div>
                              <div>
                                <Label className="text-xs font-medium text-muted-foreground">Address</Label>
                                <p className="text-sm">{address.streetAddress}</p>
                              </div>
                              <div>
                                <Label className="text-xs font-medium text-muted-foreground">City/Province</Label>
                                <p className="text-sm">{address.city}, {address.province}</p>
                              </div>
                              <div>
                                <Label className="text-xs font-medium text-muted-foreground">Postal Code/Country</Label>
                                <p className="text-sm">{address.postalCode}, {address.country}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Work History Section */}
                {formData.work_history && Array.isArray(formData.work_history) && formData.work_history.length > 0 && (
                  <AccordionItem value="work-history">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Work History ({formData.work_history.length} entries)
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      {formData.work_history.map((work: any, index: number) => (
                        <Card key={index} className="bg-muted/50">
                          <CardContent className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs font-medium text-muted-foreground">Period</Label>
                                <p className="text-sm">{work.dateFrom} to {work.dateTo}</p>
                              </div>
                              <div>
                                <Label className="text-xs font-medium text-muted-foreground">Job Title</Label>
                                <p className="text-sm font-medium">{work.jobTitle}</p>
                              </div>
                              <div>
                                <Label className="text-xs font-medium text-muted-foreground">Employer</Label>
                                <p className="text-sm">{work.employerName}</p>
                              </div>
                              <div>
                                <Label className="text-xs font-medium text-muted-foreground">Location</Label>
                                <p className="text-sm">{work.employerCity}, {work.employerProvince}, {work.employerCountry}</p>
                              </div>
                              {work.employerAddress && (
                                <div className="md:col-span-2">
                                  <Label className="text-xs font-medium text-muted-foreground">Address</Label>
                                  <p className="text-sm">{work.employerAddress}</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Additional Information Section */}
                <AccordionItem value="additional-info">
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Additional Information
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 gap-4">
                      {Object.entries(formData).map(([key, value]) => {
                        // Skip fields already displayed in other sections
                        if (['full_legal_name', 'date_of_birth', 'place_of_birth', 'citizenship', 'current_citizenship',
                             'gender', 'marital_status', 'current_address', 'contact_details', 'primary_email',
                             'telephone_numbers', 'address_history', 'work_history'].includes(key)) {
                          return null
                        }

                        // Skip empty values
                        if (!value || value === '' || (typeof value === 'boolean' && !value)) {
                          return null
                        }

                        return (
                          <div key={key}>
                            <Label className="text-sm font-medium text-muted-foreground capitalize">
                              {key.replace(/_/g, ' ')}
                            </Label>
                            <div className="text-sm mt-1">
                              {typeof value === 'boolean' ? (
                                <Badge variant={value ? "default" : "secondary"}>
                                  {value ? "Yes" : "No"}
                                </Badge>
                              ) : typeof value === 'string' && value.length > 100 ? (
                                <pre className="whitespace-pre-wrap bg-muted p-3 rounded text-xs">{value}</pre>
                              ) : (
                                <p>{String(value)}</p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}