import { z } from 'zod'

// Form validation schemas
export const ClientSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  primary_email: z.string().email("Valid email is required"),
  date_of_birth: z.date().optional(),
  phone_numbers: z.array(z.string()).optional().default([]),
  current_country: z.string().optional(),
  uci: z.string().optional(),
  notes: z.string().optional(),
})

export const FileSchema = z.object({
  client_id: z.string(),
  type: z.enum(['WORK_PERMIT', 'VISITOR_SUPERVISA', 'PERMANENT_RESIDENCE']),
  ircc_stream: z.string().optional(),
  assigned_to_user_id: z.string().optional(),
})

export const InviteSchema = z.object({
  instance_id: z.string(),
  email: z.string().email(),
  expires_at: z.date(),
})

// Type exports for components
export type Client = z.infer<typeof ClientSchema> & { id: string; created_at: Date; updated_at: Date }
export type FileType = 'WORK_PERMIT' | 'VISITOR_SUPERVISA' | 'PERMANENT_RESIDENCE'
export type FileStatus = 'INTAKE' | 'IN_PROGRESS' | 'SUBMITTED' | 'CLOSED'
export type FormInstanceStatus = 'DRAFT' | 'SENT' | 'OPEN' | 'SUBMITTED' | 'ARCHIVED'

// Form template structure
export interface FormSection {
  id: string
  title: string
  questions: FormQuestion[]
}

export interface FormQuestion {
  key: string
  label: string
  type: 'text' | 'textarea' | 'date' | 'radio' | 'checkbox' | 'select' | 'country' | 'email' | 'phone' | 'file'
  required?: boolean
  options?: string[]
  conditional?: {
    when: string
    eq: string
  }
  help_text?: string
}

export interface FormTemplate {
  code: string
  title: string
  description: string
  sections: FormSection[]
}