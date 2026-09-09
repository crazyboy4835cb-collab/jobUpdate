import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { connectDB, isMongoConnected } from './server/db';
import jobRoutes from './server/routes/jobRoutes';
import adminRoutes from './server/routes/adminRoutes';
import authRoutes from './server/routes/authRoutes';
import contactRoutes from './server/routes/contactRoutes';

const PORT = 3000;

async function startServer() {
  const app = express();

  // Middleware for parsing JSON requests
  app.use(express.json());

  // Standard CORS headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Connect to Database
  await connectDB();

  // API Health Endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'JobUpdate API',
      timestamp: new Date().toISOString(),
      database: {
        connected: isMongoConnected(),
        type: isMongoConnected() ? 'MongoDB Cluster' : 'Resilient Storage Engine',
      },
    });
  });

  // REST API Endpoints
  app.use('/api/auth', authRoutes);
  app.use('/api/jobs', jobRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/contact', contactRoutes);

  // Vite Middleware for Frontend Serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[JobUpdate] Full-stack Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[JobUpdate] Fatal server bootstrap error:', err);
  process.exit(1);
});
