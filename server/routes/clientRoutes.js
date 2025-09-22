import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all clients
router.get('/', async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      orderBy: {
        created_at: 'desc'
      }
    });
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// Get single client with details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const client = await prisma.client.findUnique({
      where: { id }
    });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ error: 'Failed to fetch client' });
  }
});

// Create new client
router.post('/', async (req, res) => {
  try {
    const { full_name, primary_email, phone_number, date_of_birth, current_country, notes, uci } = req.body;

    console.log('Creating client with data:', req.body);

    const client = await prisma.client.create({
      data: {
        full_name,
        primary_email,
        phone_number,
        date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
        current_country,
        notes,
        uci
      }
    });

    console.log('Client created successfully:', client);
    res.status(201).json(client);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Failed to create client', details: error.message });
  }
});

// Update client
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, primary_email, phone_number, date_of_birth, current_country, notes, uci } = req.body;

    const client = await prisma.client.update({
      where: { id },
      data: {
        full_name,
        primary_email,
        phone_number,
        date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
        current_country,
        notes,
        uci
      }
    });

    res.json(client);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

// Delete client
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.client.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

// Get client's form responses
router.get('/:id/responses', async (req, res) => {
  try {
    const { id } = req.params;

    const client = await prisma.client.findUnique({
      where: { id }
    });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // For now, return empty responses array
    // This will be implemented when form system is complete
    res.json([]);
  } catch (error) {
    console.error('Error fetching client responses:', error);
    res.status(500).json({ error: 'Failed to fetch client responses' });
  }
});

export default router;