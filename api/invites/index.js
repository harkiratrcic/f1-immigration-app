import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  try {
    const { method, body, query } = req;

    switch (method) {
      case 'GET':
        // Get all invites
        const { data: invites, error } = await supabase
          .from('invites')
          .select(`
            *,
            clients (
              first_name,
              last_name,
              email
            ),
            form_instances (
              form_type,
              status,
              submitted_at
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return res.status(200).json(invites);

      case 'POST':
        // Send new invite
        const { client_id, form_type, message } = body;

        if (!client_id || !form_type) {
          return res.status(400).json({
            error: 'Client ID and form type are required'
          });
        }

        // Get client details
        const { data: client, error: clientError } = await supabase
          .from('clients')
          .select('email, first_name, last_name')
          .eq('id', client_id)
          .single();

        if (clientError) throw clientError;

        // Generate invite token
        const token = crypto.randomBytes(32).toString('hex');

        // Create form instance
        const { data: formInstance, error: instanceError } = await supabase
          .from('form_instances')
          .insert([{
            client_id,
            form_type,
            token,
            status: 'sent',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (instanceError) throw instanceError;

        // Create invite record
        const { data: invite, error: inviteError } = await supabase
          .from('invites')
          .insert([{
            client_id,
            form_instance_id: formInstance.id,
            token,
            form_type,
            status: 'sent',
            message: message || `Please complete your ${form_type.replace('_', ' ')} application`,
            sent_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (inviteError) throw inviteError;

        // In production, you would send an email here
        // For now, we'll just return the invite with the form link
        const formLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://f1immigration.vercel.app'}/form/${token}`;

        return res.status(201).json({
          ...invite,
          form_link: formLink,
          client
        });

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
}