import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedTestData() {
  try {
    console.log('Creating test client...');

    // Create a test client
    const testClient = await prisma.client.create({
      data: {
        full_name: 'John Smith',
        primary_email: 'john.smith@example.com',
        phone_number: '+1 (555) 123-4567',
        current_country: 'Canada',
        date_of_birth: new Date('1985-06-15'),
        notes: 'Test client for demonstration purposes',
        uci: 'TEST-123456'
      }
    });

    console.log('Created client:', testClient.full_name);

    // Create a file for the client
    const file = await prisma.file.create({
      data: {
        client_id: testClient.id,
        type: 'WORK_PERMIT',
        status: 'IN_PROGRESS'
      }
    });

    // Get or create a form template
    let formTemplate = await prisma.formTemplate.findFirst({
      where: { code: 'WP' }
    });

    if (!formTemplate) {
      formTemplate = await prisma.formTemplate.create({
        data: {
          code: 'WP',
          title: 'Work Permit Application',
          description: 'Application form for work permit',
          sections: JSON.stringify([]),
          questions: {
            create: [
              {
                key: 'full_name',
                label: 'Full Name',
                type: 'text',
                required: true,
                order_index: 1
              },
              {
                key: 'passport_number',
                label: 'Passport Number',
                type: 'text',
                required: true,
                order_index: 2
              },
              {
                key: 'date_of_birth',
                label: 'Date of Birth',
                type: 'date',
                required: true,
                order_index: 3
              },
              {
                key: 'nationality',
                label: 'Nationality',
                type: 'country',
                required: true,
                order_index: 4
              },
              {
                key: 'occupation',
                label: 'Current Occupation',
                type: 'text',
                required: true,
                order_index: 5
              },
              {
                key: 'employer_name',
                label: 'Canadian Employer Name',
                type: 'text',
                required: true,
                order_index: 6
              },
              {
                key: 'job_title',
                label: 'Job Title in Canada',
                type: 'text',
                required: true,
                order_index: 7
              },
              {
                key: 'work_experience',
                label: 'Years of Work Experience',
                type: 'select',
                required: true,
                options: JSON.stringify(['Less than 1 year', '1-3 years', '3-5 years', '5-10 years', 'More than 10 years']),
                order_index: 8
              },
              {
                key: 'education_level',
                label: 'Highest Level of Education',
                type: 'select',
                required: true,
                options: JSON.stringify(['High School', 'Diploma', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD']),
                order_index: 9
              },
              {
                key: 'english_proficiency',
                label: 'English Language Proficiency',
                type: 'radio',
                required: true,
                options: JSON.stringify(['Basic', 'Intermediate', 'Advanced', 'Native']),
                order_index: 10
              }
            ]
          }
        },
        include: {
          questions: true
        }
      });
    } else {
      formTemplate = await prisma.formTemplate.findUnique({
        where: { id: formTemplate.id },
        include: { questions: true }
      });
    }

    // Create a submitted form instance
    const formInstance = await prisma.formInstance.create({
      data: {
        file_id: file.id,
        template_id: formTemplate.id,
        status: 'SUBMITTED',
        answers: {
          create: [
            {
              question_key: 'full_name',
              value: JSON.stringify('John Smith')
            },
            {
              question_key: 'passport_number',
              value: JSON.stringify('AB123456')
            },
            {
              question_key: 'date_of_birth',
              value: JSON.stringify('1985-06-15')
            },
            {
              question_key: 'nationality',
              value: JSON.stringify('United States')
            },
            {
              question_key: 'occupation',
              value: JSON.stringify('Software Engineer')
            },
            {
              question_key: 'employer_name',
              value: JSON.stringify('Tech Solutions Inc.')
            },
            {
              question_key: 'job_title',
              value: JSON.stringify('Senior Software Developer')
            },
            {
              question_key: 'work_experience',
              value: JSON.stringify('5-10 years')
            },
            {
              question_key: 'education_level',
              value: JSON.stringify('Bachelor\'s Degree')
            },
            {
              question_key: 'english_proficiency',
              value: JSON.stringify('Advanced')
            }
          ]
        }
      }
    });

    // Create an invite for this form
    await prisma.invite.create({
      data: {
        instance_id: formInstance.id,
        email: testClient.primary_email,
        token: 'test-token-' + Date.now(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        sent_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        opened_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        used_at: new Date()
      }
    });

    // Create another client with visitor visa application
    const testClient2 = await prisma.client.create({
      data: {
        full_name: 'Maria Garcia',
        primary_email: 'maria.garcia@example.com',
        phone_number: '+1 (555) 987-6543',
        current_country: 'Mexico',
        date_of_birth: new Date('1990-03-22'),
        notes: 'Applying for visitor visa',
        uci: 'TEST-789012'
      }
    });

    const file2 = await prisma.file.create({
      data: {
        client_id: testClient2.id,
        type: 'VISITOR_SUPERVISA',
        status: 'INTAKE'
      }
    });

    // Create visitor visa template
    let visitorTemplate = await prisma.formTemplate.findFirst({
      where: { code: 'SV' }
    });

    if (!visitorTemplate) {
      visitorTemplate = await prisma.formTemplate.create({
        data: {
          code: 'SV',
          title: 'Visitor/Super Visa Application',
          description: 'Application for visitor or super visa',
          sections: JSON.stringify([]),
          questions: {
            create: [
              {
                key: 'visit_purpose',
                label: 'Purpose of Visit',
                type: 'select',
                required: true,
                options: JSON.stringify(['Tourism', 'Family Visit', 'Business', 'Medical', 'Other']),
                order_index: 1
              },
              {
                key: 'visit_duration',
                label: 'Intended Duration of Stay',
                type: 'text',
                required: true,
                order_index: 2
              },
              {
                key: 'ties_to_home',
                label: 'Ties to Home Country',
                type: 'textarea',
                required: true,
                order_index: 3
              },
              {
                key: 'funds_available',
                label: 'Funds Available for Trip (CAD)',
                type: 'text',
                required: true,
                order_index: 4
              }
            ]
          }
        },
        include: {
          questions: true
        }
      });
    } else {
      visitorTemplate = await prisma.formTemplate.findUnique({
        where: { id: visitorTemplate.id },
        include: { questions: true }
      });
    }

    const formInstance2 = await prisma.formInstance.create({
      data: {
        file_id: file2.id,
        template_id: visitorTemplate.id,
        status: 'SUBMITTED',
        answers: {
          create: [
            {
              question_key: 'visit_purpose',
              value: JSON.stringify('Family Visit')
            },
            {
              question_key: 'visit_duration',
              value: JSON.stringify('3 months')
            },
            {
              question_key: 'ties_to_home',
              value: JSON.stringify('I own a business in Mexico City and have family obligations. I need to return for my daughter\'s graduation.')
            },
            {
              question_key: 'funds_available',
              value: JSON.stringify('$15,000')
            }
          ]
        }
      }
    });

    await prisma.invite.create({
      data: {
        instance_id: formInstance2.id,
        email: testClient2.primary_email,
        token: 'test-token-2-' + Date.now(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        sent_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        opened_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        used_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    });

    console.log('Test data created successfully!');
    console.log('Created clients:');
    console.log('1. John Smith - Work Permit (SUBMITTED)');
    console.log('2. Maria Garcia - Visitor Visa (SUBMITTED)');

  } catch (error) {
    console.error('Error creating test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTestData();