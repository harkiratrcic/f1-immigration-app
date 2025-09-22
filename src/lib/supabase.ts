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

// API helper functions using the new Vercel endpoints
const API_BASE = import.meta.env.VITE_API_URL || '/api'

export const api = {
  // Clients
  getClients: async (): Promise<Client[]> => {
    const response = await fetch(`${API_BASE}/clients`)
    if (!response.ok) throw new Error('Failed to fetch clients')
    return response.json()
  },

  getClient: async (id: string): Promise<Client> => {
    const response = await fetch(`${API_BASE}/clients?id=${id}`)
    if (!response.ok) throw new Error('Failed to fetch client')
    return response.json()
  },

  createClient: async (client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client> => {
    const response = await fetch(`${API_BASE}/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client)
    })
    if (!response.ok) throw new Error('Failed to create client')
    return response.json()
  },

  updateClient: async (id: string, client: Partial<Client>): Promise<Client> => {
    const response = await fetch(`${API_BASE}/clients?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client)
    })
    if (!response.ok) throw new Error('Failed to update client')
    return response.json()
  },

  deleteClient: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/clients?id=${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete client')
  },

  // Form Templates
  getFormTemplates: async (): Promise<FormTemplate[]> => {
    const response = await fetch(`${API_BASE}/forms/templates`)
    if (!response.ok) throw new Error('Failed to fetch form templates')
    return response.json()
  },

  // Form Instances
  getFormInstances: async (): Promise<FormInstance[]> => {
    const response = await fetch(`${API_BASE}/forms/instances`)
    if (!response.ok) throw new Error('Failed to fetch form instances')
    return response.json()
  },

  createFormInstance: async (data: { client_id: string; form_type: string; template_id?: string }): Promise<FormInstance> => {
    const response = await fetch(`${API_BASE}/forms/instances`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to create form instance')
    return response.json()
  },

  submitForm: async (id: string, formData: Record<string, any>): Promise<FormInstance> => {
    const response = await fetch(`${API_BASE}/forms/instances?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ form_data: formData, status: 'submitted' })
    })
    if (!response.ok) throw new Error('Failed to submit form')
    return response.json()
  },

  // Invites
  getInvites: async (): Promise<Invite[]> => {
    const response = await fetch(`${API_BASE}/invites`)
    if (!response.ok) throw new Error('Failed to fetch invites')
    return response.json()
  },

  sendInvite: async (data: { client_id: string; form_type: string; message?: string }): Promise<Invite & { form_link: string }> => {
    const response = await fetch(`${API_BASE}/invites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to send invite')
    return response.json()
  }
}