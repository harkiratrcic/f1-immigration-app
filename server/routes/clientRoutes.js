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
    const { first_name, last_name, email, phone, country, notes, uci } = req.body;

    const client = await prisma.client.create({
      data: {
        first_name,
        last_name,
        email,
        phone,
        country,
        notes,
        uci
      }
    });

    res.status(201).json(client);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

// Update client
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, phone, country, notes, uci } = req.body;

    const client = await prisma.client.update({
      where: { id },
      data: {
        first_name,
        last_name,
        email,
        phone,
        country,
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