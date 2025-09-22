import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Default form templates
const defaultTemplates = [
  {
    name: 'Work Permit Application',
    type: 'work_permit',
    description: 'Standard work permit application form',
    fields: {
      personal: ['full_name', 'date_of_birth', 'nationality', 'passport_number'],
      contact: ['email', 'phone', 'address'],
      employment: ['job_title', 'employer', 'start_date', 'salary'],
      documents: ['passport', 'job_offer', 'education_certificates']
    },
    active: true
  },
  {
    name: 'Permanent Residence Application',
    type: 'pr_application',
    description: 'Permanent residence application form',
    fields: {
      personal: ['full_name', 'date_of_birth', 'nationality', 'marital_status'],
      contact: ['email', 'phone', 'current_address', 'permanent_address'],
      immigration: ['entry_date', 'current_status', 'uci_number'],
      family: ['spouse_details', 'dependent_details'],
      documents: ['passport', 'proof_of_funds', 'police_clearance', 'medical_exam']
    },
    active: true
  },
  {
    name: 'Super Visa Application',
    type: 'super_visa',
    description: 'Super visa application for parents and grandparents',
    fields: {
      personal: ['full_name', 'date_of_birth', 'relationship_to_sponsor'],
      sponsor: ['sponsor_name', 'sponsor_income', 'sponsor_address'],
      documents: ['passport', 'insurance_proof', 'invitation_letter', 'income_proof']
    },
    active: true
  }
];

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    // Check if templates exist
    const { data: templates, error: fetchError } = await supabase
      .from('form_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) throw fetchError;

    // If no templates exist, create default ones
    if (!templates || templates.length === 0) {
      const { data: newTemplates, error: insertError } = await supabase
        .from('form_templates')
        .insert(defaultTemplates.map(template => ({
          ...template,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })))
        .select();

      if (insertError) throw insertError;
      return res.status(200).json(newTemplates);
    }

    return res.status(200).json(templates);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
}