import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();

const sampleClients = [
  {
    id: 'sample-client-1',
    full_name: 'John Doe',
    primary_email: 'john.doe@example.com',
    phone_number: '+1-555-0123',
    current_country: 'United States',
    uci: 'UCI123456',
    notes: 'Sample client for testing'
  },
  {
    id: 'sample-client-2',
    full_name: 'Maria Garcia',
    primary_email: 'maria.garcia@example.com',
    phone_number: '+1-555-0124',
    current_country: 'Mexico',
    uci: 'UCI123457',
    notes: 'Work permit application'
  },
  {
    id: 'sample-client-3',
    full_name: 'Ahmed Khan',
    primary_email: 'ahmed.khan@example.com',
    phone_number: '+1-555-0125',
    current_country: 'Pakistan',
    uci: 'UCI123458',
    notes: 'Permanent residence application'
  }
];

async function seed() {
  if (process.env.NODE_ENV === 'production') {
    console.log('🚫 NODE_ENV=production detected. Skipping seed script.');
    return;
  }

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not configured. Cannot seed data.');
    process.exit(1);
  }

  try {
    await prisma.$connect();
    console.log('✅ Connected to database');

    for (const client of sampleClients) {
      const existing = await prisma.client.findUnique({
        where: { primary_email: client.primary_email }
      });

      if (existing) {
        console.log(`ℹ️ Client with email ${client.primary_email} already exists (id: ${existing.id}). Skipping.`);
        continue;
      }

      await prisma.client.create({ data: client });
      console.log(`🌱 Seeded client ${client.full_name}`);
    }

    console.log('✅ Seed data script completed successfully.');
  } catch (error) {
    console.error('❌ Failed to seed test data:', error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

seed();
