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
    const { id } = query;

    switch (method) {
      case 'GET':
        if (id) {
          // Get single form instance
          const { data: formInstance, error } = await supabase
            .from('form_instances')
            .select(`
              *,
              clients (
                first_name,
                last_name,
                email
              ),
              form_templates (
                name,
                fields
              )
            `)
            .eq('id', id)
            .single();

          if (error) throw error;
          return res.status(200).json(formInstance);
        } else {
          // Get all form instances
          const { data: instances, error } = await supabase
            .from('form_instances')
            .select(`
              *,
              clients (
                first_name,
                last_name,
                email
              )
            `)
            .order('created_at', { ascending: false });

          if (error) throw error;
          return res.status(200).json(instances);
        }

      case 'POST':
        // Create new form instance
        const { client_id, form_type, template_id } = body;

        if (!client_id || !form_type) {
          return res.status(400).json({
            error: 'Client ID and form type are required'
          });
        }

        // Generate unique token
        const token = crypto.randomBytes(32).toString('hex');

        const { data: newInstance, error: createError } = await supabase
          .from('form_instances')
          .insert([{
            client_id,
            form_type,
            template_id,
            token,
            status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (createError) throw createError;
        return res.status(201).json(newInstance);

      case 'PUT':
        if (!id) {
          return res.status(400).json({ error: 'Form instance ID is required' });
        }

        // Update form instance (submit)
        const { data: updatedInstance, error: updateError } = await supabase
          .from('form_instances')
          .update({
            ...body,
            status: body.status || 'submitted',
            submitted_at: body.status === 'submitted' ? new Date().toISOString() : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();

        if (updateError) throw updateError;

        // If form data is provided, save it
        if (body.form_data) {
          const { error: responseError } = await supabase
            .from('form_responses')
            .insert([{
              form_instance_id: id,
              client_id: updatedInstance.client_id,
              data: body.form_data,
              created_at: new Date().toISOString()
            }]);

          if (responseError) throw responseError;
        }

        return res.status(200).json(updatedInstance);

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
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