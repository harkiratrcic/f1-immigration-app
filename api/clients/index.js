import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  try {
    const { method, query, body } = req;
    const { id } = query;

    switch (method) {
      case 'GET':
        if (id) {
          // Get single client
          const { data: client, error } = await supabase
            .from('clients')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;
          return res.status(200).json(client);
        } else {
          // Get all clients
          const { data: clients, error } = await supabase
            .from('clients')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;
          return res.status(200).json(clients);
        }

      case 'POST':
        // Create new client
        const { data: newClient, error: createError } = await supabase
          .from('clients')
          .insert([{
            ...body,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (createError) throw createError;
        return res.status(201).json(newClient);

      case 'PUT':
        if (!id) {
          return res.status(400).json({ error: 'Client ID is required' });
        }

        // Update client
        const { data: updatedClient, error: updateError } = await supabase
          .from('clients')
          .update({
            ...body,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();

        if (updateError) throw updateError;
        return res.status(200).json(updatedClient);

      case 'DELETE':
        if (!id) {
          return res.status(400).json({ error: 'Client ID is required' });
        }

        // Delete client
        const { error: deleteError } = await supabase
          .from('clients')
          .delete()
          .eq('id', id);

        if (deleteError) throw deleteError;
        return res.status(204).end();

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
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