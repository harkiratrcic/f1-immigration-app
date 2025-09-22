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

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, '../dist')));

// API Routes
app.use('/api/clients', clientRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/invites', inviteRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'F1 Immigration Inc. server is running',
    environment: process.env.NODE_ENV || 'production'
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Database connection test
async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Run migrations on startup
    console.log('🔄 Running database migrations...');
    const { spawn } = await import('child_process');
    const migrate = spawn('npx', ['prisma', 'migrate', 'deploy'], {
      stdio: 'inherit'
    });

    migrate.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Database migrations completed');
      } else {
        console.log('⚠️ Database migrations had some issues (this might be okay)');
      }
    });

  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚂 F1 Immigration Inc. server running on port ${PORT}`);
  await testDatabaseConnection();
});

export { prisma };