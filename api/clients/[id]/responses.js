import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

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
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Client ID is required' });
    }

    // Get client's form responses
    const { data: responses, error } = await supabase
      .from('form_responses')
      .select(`
        *,
        form_instances (
          form_type,
          status,
          created_at
        )
      `)
      .eq('client_id', id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json(responses);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
}