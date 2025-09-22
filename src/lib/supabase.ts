import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface Client {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  country?: string
  uci?: string
  notes?: string
  status: string
  created_at: string
  updated_at: string
}

export interface FormTemplate {
  id: string
  name: string
  type: string
  description?: string
  fields: Record<string, any>
  active: boolean
  created_at: string
  updated_at: string
}

export interface FormInstance {
  id: string
  client_id: string
  template_id?: string
  form_type: string
  token: string
  status: 'draft' | 'sent' | 'opened' | 'pending' | 'submitted' | 'completed' | 'cancelled'
  opened_at?: string
  submitted_at?: string
  created_at: string
  updated_at: string
  clients?: Pick<Client, 'first_name' | 'last_name' | 'email'>
  form_templates?: Pick<FormTemplate, 'name' | 'fields'>
}

export interface FormResponse {
  id: string
  form_instance_id: string
  client_id: string
  data: Record<string, any>
  created_at: string
}

export interface Invite {
  id: string
  client_id: string
  form_instance_id: string
  token: string
  form_type: string
  status: 'sent' | 'opened' | 'expired' | 'completed'
  message?: string
  sent_at: string
  opened_at?: string
  expired_at?: string
  created_at: string
  updated_at: string
  clients?: Pick<Client, 'first_name' | 'last_name' | 'email'>
  form_instances?: Pick<FormInstance, 'form_type' | 'status' | 'submitted_at'>
}

// Note: This file contains Supabase configuration for future use
// Currently using Prisma API via src/lib/api.ts