import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all clients
router.get('/', async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      include: {
        files: true
      },
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
      where: { id },
      include: {
        files: {
          include: {
            form_instances: {
              include: {
                invites: true,
                answers: true
              }
            }
          }
        }
      }
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
    const { full_name, primary_email, phone_number, current_country, notes } = req.body;

    const client = await prisma.client.create({
      data: {
        full_name,
        primary_email,
        phone_number,
        current_country,
        notes
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
    const { full_name, primary_email, phone_number, current_country, notes, uci } = req.body;

    const client = await prisma.client.update({
      where: { id },
      data: {
        full_name,
        primary_email,
        phone_number,
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
      where: { id },
      include: {
        files: {
          include: {
            form_instances: {
              include: {
                template: true,
                answers: true,
                invites: true
              }
            }
          }
        }
      }
    });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Extract and format responses
    const responses = [];
    client.files.forEach(file => {
      file.form_instances.forEach(instance => {
        responses.push({
          id: instance.id,
          fileId: file.id,
          fileType: file.type,
          formTemplate: instance.template,
          status: instance.status,
          answers: instance.answers,
          invites: instance.invites,
          createdAt: instance.created_at,
          updatedAt: instance.updated_at
        });
      });
    });

    res.json(responses);
  } catch (error) {
    console.error('Error fetching client responses:', error);
    res.status(500).json({ error: 'Failed to fetch client responses' });
  }
});

export default router;