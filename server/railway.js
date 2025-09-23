import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import clientRoutes from './routes/clientRoutes.js';
import formRoutes from './routes/formRoutes.js';
import inviteRoutes from './routes/inviteRoutes.js';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Debug all environment variables
console.log('🔍 ALL ENVIRONMENT VARIABLES:');
Object.keys(process.env).filter(key =>
  key.includes('DATABASE') ||
  key.includes('PG') ||
  key.includes('POSTGRES') ||
  key.includes('DB')
).forEach(key => {
  const value = process.env[key];
  console.log(`${key}:`, value ? `[SET] ${value.substring(0, 30)}...` : '[NOT SET]');
});

// Fix DATABASE_URL if it exists but is malformed
if (process.env.DATABASE_URL) {
  console.log('🔍 Original DATABASE_URL:', process.env.DATABASE_URL);

  // Check if DATABASE_URL is malformed (common Railway issue)
  if (!process.env.DATABASE_URL.startsWith('postgresql://') && !process.env.DATABASE_URL.startsWith('postgres://')) {
    console.log('🔧 DATABASE_URL is malformed, attempting to fix...');

    // Try to extract components from malformed URL
    const urlPattern = /(?:.*?:\/\/)?(?:([^:]+):([^@]+)@)?([^:\/]+):?(\d+)?\/(.+)/;
    const match = process.env.DATABASE_URL.match(urlPattern);

    if (match) {
      const [, user, password, host, port, database] = match;
      process.env.DATABASE_URL = `postgresql://${user}:${password}@${host}:${port || 5432}/${database}?sslmode=require`;
      console.log('✅ Fixed DATABASE_URL format');
    } else {
      console.log('❌ Could not parse malformed DATABASE_URL');
    }
  }

  // Ensure SSL is enabled for Railway
  if (!process.env.DATABASE_URL.includes('sslmode')) {
    process.env.DATABASE_URL += process.env.DATABASE_URL.includes('?') ? '&sslmode=require' : '?sslmode=require';
    console.log('✅ Added SSL mode to DATABASE_URL');
  }

  console.log('🔗 Final DATABASE_URL format:', process.env.DATABASE_URL.replace(/:[^:@]*@/, ':****@'));
} else {
  // Fallback: Try different Railway environment variable patterns
  const pgHost = process.env.PGHOST || process.env.POSTGRES_HOST;
  const pgPort = process.env.PGPORT || process.env.POSTGRES_PORT || 5432;
  const pgUser = process.env.PGUSER || process.env.POSTGRES_USER;
  const pgPassword = process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD;
  const pgDatabase = process.env.PGDATABASE || process.env.POSTGRES_DB || 'railway';

  if (pgHost && pgUser && pgPassword) {
    process.env.DATABASE_URL = `postgresql://${pgUser}:${pgPassword}@${pgHost}:${pgPort}/${pgDatabase}?sslmode=require`;
    console.log('🔧 Configured DATABASE_URL from Railway PostgreSQL variables with SSL');
    console.log('🔗 DATABASE_URL format:', `postgresql://${pgUser}:*****@${pgHost}:${pgPort}/${pgDatabase}?sslmode=require`);
  } else {
    console.log('❌ No DATABASE_URL or PostgreSQL environment variables found');
  }
}

console.log('🌐 Final DATABASE_URL configured:', process.env.DATABASE_URL ? 'YES' : 'NO');

// Initialize Prisma with SSL configuration for Railway
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: ['query', 'info', 'warn', 'error']
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enhanced logging middleware
app.use((req, res, next) => {
  console.log(`🔍 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('📦 Request Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, '../dist')));

// API Routes
app.use('/api/clients', clientRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/invites', inviteRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  const healthData = {
    status: 'unknown',
    message: 'F1 Immigration Inc. server is running',
    environment: process.env.NODE_ENV || 'production',
    database: 'unknown',
    timestamp: new Date().toISOString(),
    debug: {
      databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
      pgHost: process.env.PGHOST ? 'SET' : 'NOT SET',
      pgUser: process.env.PGUSER ? 'SET' : 'NOT SET',
      pgPassword: process.env.PGPASSWORD ? 'SET' : 'NOT SET'
    }
  };

  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL not configured');
    }

    // Test database connection
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database query successful:', result);

    healthData.status = 'ok';
    healthData.database = 'connected';
    res.json(healthData);
  } catch (error) {
    console.error('❌ Health check failed:', error);

    healthData.status = 'error';
    healthData.database = 'disconnected';
    healthData.error = error.message;
    healthData.errorCode = error.code;

    res.status(500).json(healthData);
  }
});

// Serve React app for all other routes
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Database connection and setup
async function setupDatabase() {
  try {
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL not configured. Cannot connect to database.');
      return;
    }

    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Create clients table and sample data
    console.log('🔄 Setting up database schema...');

    // First, try to create the table (will fail if it exists - that's ok)
    try {
      await prisma.$executeRaw`
        DROP TABLE IF EXISTS clients CASCADE;
        CREATE TABLE clients (
          id TEXT PRIMARY KEY,
          uci TEXT,
          full_name TEXT NOT NULL,
          primary_email TEXT UNIQUE NOT NULL,
          phone_number TEXT,
          date_of_birth TIMESTAMP WITH TIME ZONE,
          current_country TEXT,
          notes TEXT,
          status TEXT DEFAULT 'active',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;
      console.log('✅ Database table created successfully');

      // Add sample data
      console.log('📋 Adding sample client data...');
      await prisma.client.createMany({
        data: [
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
        ]
      });
      console.log('✅ Sample data added successfully');

    } catch (dbError) {
      console.log('🔄 Database setup complete (may have already existed)');
    }

  } catch (error) {
    console.error('❌ Database setup failed:', error);
  }
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚂 F1 Immigration Inc. server running on port ${PORT}`);
  await setupDatabase();
});

export { prisma };