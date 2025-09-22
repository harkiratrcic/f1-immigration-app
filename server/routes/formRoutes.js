import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all form templates
router.get('/templates', async (req, res) => {
  try {
    const templates = await prisma.formTemplate.findMany({
      where: { is_active: true },
      include: {
        questions: {
          orderBy: { order_index: 'asc' }
        }
      }
    });
    res.json(templates);
  } catch (error) {
    console.error('Error fetching form templates:', error);
    res.status(500).json({ error: 'Failed to fetch form templates' });
  }
});

// Get single form template
router.get('/templates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const template = await prisma.formTemplate.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order_index: 'asc' }
        }
      }
    });

    if (!template) {
      return res.status(404).json({ error: 'Form template not found' });
    }

    res.json(template);
  } catch (error) {
    console.error('Error fetching form template:', error);
    res.status(500).json({ error: 'Failed to fetch form template' });
  }
});

// Create form instance for a client
router.post('/instances', async (req, res) => {
  try {
    const { file_id, template_id, status = 'DRAFT' } = req.body;

    const formInstance = await prisma.formInstance.create({
      data: {
        file_id,
        template_id,
        status,
        schema_version: '1.0'
      },
      include: {
        template: true,
        file: {
          include: {
            client: true
          }
        }
      }
    });

    res.status(201).json(formInstance);
  } catch (error) {
    console.error('Error creating form instance:', error);
    res.status(500).json({ error: 'Failed to create form instance' });
  }
});

// Update form instance status
router.put('/instances/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const formInstance = await prisma.formInstance.update({
      where: { id },
      data: { status },
      include: {
        template: true,
        answers: true,
        invites: true
      }
    });

    res.json(formInstance);
  } catch (error) {
    console.error('Error updating form instance:', error);
    res.status(500).json({ error: 'Failed to update form instance' });
  }
});

// Save form answers
router.post('/instances/:id/answers', async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;

    // Update or create answers
    const answerPromises = Object.entries(answers).map(([key, value]) =>
      prisma.answer.upsert({
        where: {
          instance_id_question_key: {
            instance_id: id,
            question_key: key
          }
        },
        update: { value },
        create: {
          instance_id: id,
          question_key: key,
          value
        }
      })
    );

    await Promise.all(answerPromises);

    // Update form instance status to OPEN if it was DRAFT
    await prisma.formInstance.update({
      where: { id },
      data: {
        status: 'OPEN'
      }
    });

    res.json({ message: 'Answers saved successfully' });
  } catch (error) {
    console.error('Error saving form answers:', error);
    res.status(500).json({ error: 'Failed to save form answers' });
  }
});

// Submit form
router.post('/instances/:id/submit', async (req, res) => {
  try {
    const { id } = req.params;
    const { consent_text, esign_name, ip_address } = req.body;

    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update form status to SUBMITTED
      const formInstance = await tx.formInstance.update({
        where: { id },
        data: { status: 'SUBMITTED' }
      });

      // Create consent record
      const consent = await tx.consent.create({
        data: {
          instance_id: id,
          text_hash: Buffer.from(consent_text).toString('base64'),
          accepted_at: new Date(),
          esign_name,
          esign_timestamp: new Date(),
          ip_address
        }
      });

      // Create audit log
      await tx.auditLog.create({
        data: {
          instance_id: id,
          action: 'FORM_SUBMITTED',
          meta: {
            submitted_at: new Date(),
            ip_address
          },
          ip_address
        }
      });

      return { formInstance, consent };
    });

    res.json(result);
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ error: 'Failed to submit form' });
  }
});

// Get form instance with answers
router.get('/instances/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const formInstance = await prisma.formInstance.findUnique({
      where: { id },
      include: {
        template: {
          include: {
            questions: {
              orderBy: { order_index: 'asc' }
            }
          }
        },
        answers: true,
        file: {
          include: {
            client: true
          }
        },
        invites: true
      }
    });

    if (!formInstance) {
      return res.status(404).json({ error: 'Form instance not found' });
    }

    res.json(formInstance);
  } catch (error) {
    console.error('Error fetching form instance:', error);
    res.status(500).json({ error: 'Failed to fetch form instance' });
  }
});

// Initialize form templates (run once to seed database)
router.post('/templates/init', async (req, res) => {
  try {
    const templates = [
      {
        code: 'WP',
        title: 'Work Permit Application',
        description: 'Complete intake form for Work Permit applications',
        sections: {},
        questions: [
          { key: 'full_name', label: 'Full Name', type: 'text', required: true, order_index: 1 },
          { key: 'date_of_birth', label: 'Date of Birth', type: 'date', required: true, order_index: 2 },
          { key: 'nationality', label: 'Nationality', type: 'country', required: true, order_index: 3 },
          { key: 'passport_number', label: 'Passport Number', type: 'text', required: true, order_index: 4 },
          { key: 'email', label: 'Email Address', type: 'email', required: true, order_index: 5 },
          { key: 'phone', label: 'Phone Number', type: 'phone', required: true, order_index: 6 },
          { key: 'job_title', label: 'Job Title in Canada', type: 'text', required: true, order_index: 7 },
          { key: 'employer_name', label: 'Employer Name', type: 'text', required: true, order_index: 8 },
          { key: 'lmia_number', label: 'LMIA Number (if applicable)', type: 'text', required: false, order_index: 9 }
        ]
      },
      {
        code: 'SV',
        title: 'Super Visa / Visitor Application',
        description: 'Complete intake form for Super Visa or Visitor applications',
        sections: {},
        questions: [
          { key: 'full_name', label: 'Full Name', type: 'text', required: true, order_index: 1 },
          { key: 'date_of_birth', label: 'Date of Birth', type: 'date', required: true, order_index: 2 },
          { key: 'nationality', label: 'Nationality', type: 'country', required: true, order_index: 3 },
          { key: 'passport_number', label: 'Passport Number', type: 'text', required: true, order_index: 4 },
          { key: 'email', label: 'Email Address', type: 'email', required: true, order_index: 5 },
          { key: 'visit_purpose', label: 'Purpose of Visit', type: 'textarea', required: true, order_index: 6 },
          { key: 'intended_stay', label: 'Intended Length of Stay', type: 'text', required: true, order_index: 7 },
          { key: 'ties_to_home', label: 'Ties to Home Country', type: 'textarea', required: true, order_index: 8 }
        ]
      },
      {
        code: 'PR',
        title: 'Permanent Residence Application',
        description: 'Complete intake form for Permanent Residence applications',
        sections: {},
        questions: [
          { key: 'full_name', label: 'Full Name', type: 'text', required: true, order_index: 1 },
          { key: 'date_of_birth', label: 'Date of Birth', type: 'date', required: true, order_index: 2 },
          { key: 'nationality', label: 'Nationality', type: 'country', required: true, order_index: 3 },
          { key: 'passport_number', label: 'Passport Number', type: 'text', required: true, order_index: 4 },
          { key: 'email', label: 'Email Address', type: 'email', required: true, order_index: 5 },
          { key: 'phone', label: 'Phone Number', type: 'phone', required: true, order_index: 6 },
          { key: 'pr_stream', label: 'Immigration Stream', type: 'select', required: true, order_index: 7,
            options: ['Express Entry', 'Provincial Nominee', 'Quebec Selected', 'Family Class', 'Other'] },
          { key: 'language_test', label: 'Language Test Results', type: 'textarea', required: true, order_index: 8 },
          { key: 'education', label: 'Highest Education', type: 'text', required: true, order_index: 9 },
          { key: 'work_experience', label: 'Work Experience Summary', type: 'textarea', required: true, order_index: 10 }
        ]
      }
    ];

    for (const template of templates) {
      const { questions, ...templateData } = template;

      const createdTemplate = await prisma.formTemplate.create({
        data: templateData
      });

      for (const question of questions) {
        await prisma.question.create({
          data: {
            ...question,
            template_id: createdTemplate.id,
            options: question.options ? question.options : null
          }
        });
      }
    }

    res.json({ message: 'Form templates initialized successfully' });
  } catch (error) {
    console.error('Error initializing form templates:', error);
    res.status(500).json({ error: 'Failed to initialize form templates' });
  }
});

export default router;