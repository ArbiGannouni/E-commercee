/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies up to 50MB
app.use(express.json({ limit: '50mb' }));

// MongoDB backend endpoint
import dbStoreHandler from './api/store.js';
app.all('/api/store', async (req, res) => {
  try {
    await dbStoreHandler(req, res);
  } catch (err) {
    console.error('Express production API handler error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// Serve the compiled static assets
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback routing - route all other requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Run standalone server if outside Serverless Vercel environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server active on port ${PORT}`);
  });
}

export default app;
