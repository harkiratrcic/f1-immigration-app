import express from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const router = express.Router();
const prisma = new PrismaClient();

// Get all invites
router.get('/', async (req, res) => {
  try {
    const invites = await prisma.invite.findMany({
      include: {
        instance: {
          include: {
            template: true,
            file: {
              include: {
                client: true
              }
            }
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    res.json(invites);
  } catch (error) {
    console.error('Error fetching invites:', error);
    res.status(500).json({ error: 'Failed to fetch invites' });
  }
});

// Create and send invite
router.post('/send', async (req, res) => {
  try {
    const { client_id, form_type, email } = req.body;

    // First, create a file for the client if it doesn't exist
    let file = await prisma.file.findFirst({
      where: {
        client_id,
        type: form_type
      }
    });

    if (!file) {
      file = await prisma.file.create({
        data: {
          client_id,
          type: form_type,
          status: 'INTAKE'
        }
      });
    }

    // Map FileType to FormCode
    const formCodeMap = {
      'WORK_PERMIT': 'WP',
      'VISITOR_SUPERVISA': 'SV',
      'PERMANENT_RESIDENCE': 'PR'
    };

    const formCode = formCodeMap[form_type];
    if (!formCode) {
      return res.status(400).json({ error: 'Invalid form type' });
    }

    // Get the form template
    const template = await prisma.formTemplate.findFirst({
      where: {
        code: formCode
      }
    });

    if (!template) {
      return res.status(404).json({ error: 'Form template not found' });
    }

    // Create form instance
    const formInstance = await prisma.formInstance.create({
      data: {
        file_id: file.id,
        template_id: template.id,
        status: 'SENT'
      }
    });

    // Generate unique token
    const token = crypto.randomBytes(32).toString('hex');

    // Create invite
    const invite = await prisma.invite.create({
      data: {
        instance_id: formInstance.id,
        email,
        token,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        sent_at: new Date()
      },
      include: {
        instance: {
          include: {
            template: true,
            file: {
              include: {
                client: true
              }
            }
          }
        }
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        instance_id: formInstance.id,
        action: 'INVITE_SENT',
        meta: {
          email,
          token,
          sent_at: new Date()
        }
      }
    });

    res.status(201).json({
      invite,
      form_link: `/form/${token}`
    });
  } catch (error) {
    console.error('Error sending invite:', error);
    res.status(500).json({ error: 'Failed to send invite' });
  }
});

// Get invite by token
router.get('/token/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const invite = await prisma.invite.findUnique({
      where: { token },
      include: {
        instance: {
          include: {
            template: {
              include: {
                questions: {
                  orderBy: { order_index: 'asc' }
                }
              }
            },
            file: {
              include: {
                client: true
              }
            },
            answers: true
          }
        }
      }
    });

    if (!invite) {
      return res.status(404).json({ error: 'Invite not found' });
    }

    // Check if invite is expired
    if (new Date(invite.expires_at) < new Date()) {
      return res.status(410).json({ error: 'Invite has expired' });
    }

    // Check if already used
    if (invite.used_at) {
      return res.status(410).json({ error: 'Invite has already been used' });
    }

    // Mark as opened if first time
    if (!invite.opened_at) {
      await prisma.invite.update({
        where: { id: invite.id },
        data: { opened_at: new Date() }
      });
    }

    res.json(invite);
  } catch (error) {
    console.error('Error fetching invite:', error);
    res.status(500).json({ error: 'Failed to fetch invite' });
  }
});

// Resend invite
router.post('/:id/resend', async (req, res) => {
  try {
    const { id } = req.params;

    const invite = await prisma.invite.update({
      where: { id },
      data: {
        sent_at: new Date(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Reset expiry
      },
      include: {
        instance: {
          include: {
            template: true,
            file: {
              include: {
                client: true
              }
            }
          }
        }
      }
    });

    res.json(invite);
  } catch (error) {
    console.error('Error resending invite:', error);
    res.status(500).json({ error: 'Failed to resend invite' });
  }
});

// Mark invite as used
router.post('/:id/use', async (req, res) => {
  try {
    const { id } = req.params;

    const invite = await prisma.invite.update({
      where: { id },
      data: {
        used_at: new Date()
      }
    });

    res.json(invite);
  } catch (error) {
    console.error('Error marking invite as used:', error);
    res.status(500).json({ error: 'Failed to mark invite as used' });
  }
});

// Get invites by client
router.get('/client/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;

    const invites = await prisma.invite.findMany({
      where: {
        instance: {
          file: {
            client_id: clientId
          }
        }
      },
      include: {
        instance: {
          include: {
            template: true,
            file: true,
            answers: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    res.json(invites);
  } catch (error) {
    console.error('Error fetching client invites:', error);
    res.status(500).json({ error: 'Failed to fetch client invites' });
  }
});

export default router;