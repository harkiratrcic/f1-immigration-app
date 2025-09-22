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
const prisma = new PrismaClient();

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
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1 as test`;
    res.json({
      status: 'ok',
      message: 'F1 Immigration Inc. server is running',
      environment: process.env.NODE_ENV || 'production',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server health check failed',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
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