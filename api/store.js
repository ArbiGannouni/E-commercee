import { MongoClient } from 'mongodb';

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }
  let uri = process.env.MONGODB_URI;
  if (uri) {
    uri = uri.trim().replace(/^["']|["']$/g, '');
  }
  if (!uri || (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://'))) {
    uri = 'mongodb+srv://jouhanarbi_db_user:kE3tZAKQ31KV4Xru@cluster0.mwrngyd.mongodb.net/?appName=Cluster0';
  }
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  });
  await client.connect();
  const db = client.db('aether_store');
  cachedClient = client;
  cachedDb = db;
  return { client, db };
}

// Robust helper to parse body from streams under different cloud hosting runtimes
async function parseRequestBody(req) {
  if (req.body) {
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch (e) {
        // Fall through
      }
    } else {
      return req.body;
    }
  }

  // If req.on is not a function (mock/processed request under Vite/Vercel middlewares), return empty
  if (!req || typeof req.on !== 'function') {
    return {};
  }

  // Read raw request body stream with a 1-second safety freeze safeguard
  return new Promise((resolve) => {
    let bodyData = '';
    const timeout = setTimeout(() => {
      resolve({});
    }, 1000);

    req.on('data', chunk => {
      bodyData += chunk;
    });
    req.on('end', () => {
      clearTimeout(timeout);
      try {
        resolve(bodyData ? JSON.parse(bodyData) : {});
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', () => {
      clearTimeout(timeout);
      resolve({});
    });
  });
}

export default async function handler(req, res) {
  // Setup CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('store_state');

    if (req.method === 'GET') {
      const documents = await collection.find({}).toArray();
      const state = {};
      documents.forEach(doc => {
        state[doc._id] = doc.data;
      });
      return res.status(200).json(state);
    }

    if (req.method === 'POST') {
      let body = await parseRequestBody(req);

      if (!body || Object.keys(body).length === 0) {
        return res.status(400).json({ error: 'Missing or empty request body' });
      }

      // Option 1: Saved as single key and data
      if (body.key && body.data !== undefined) {
        await collection.updateOne(
          { _id: body.key },
          { $set: { data: body.data, updatedAt: new Date() } },
          { upsert: true }
        );
        return res.status(200).json({ success: true, message: `Saved ${body.key} successfully` });
      }

      // Option 2: Saved as bulk keys
      const keys = ['products', 'orders', 'customers', 'promoCodes', 'settings', 'userCredentials', 'simulatedEmails', 'adminPermissions'];
      const operations = [];
      for (const key of keys) {
        if (body[key] !== undefined) {
          operations.push(
            collection.updateOne(
              { _id: key },
              { $set: { data: body[key], updatedAt: new Date() } },
              { upsert: true }
            )
          );
        }
      }

      if (operations.length > 0) {
        await Promise.all(operations);
        return res.status(200).json({ success: true, message: 'Saved multiple collections successfully' });
      }

      return res.status(400).json({ error: 'No valid keys provided for saving' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Database connection error:', error);
    let suggestFix = '';
    if (error.message && (error.message.includes('SSL') || error.message.includes('alert') || error.message.includes('ServerSelectionError') || error.message.includes('MongoServerSelectionError'))) {
      suggestFix = ' This is likely caused by MongoDB Atlas IP Whitelisting. Since Vercel/Cloud Run uses dynamic outbound IPs, you must go to your MongoDB Atlas dashboard, navigate to "Network Access" under Security, click "Add IP Address", choose "Allow Access From Anywhere" (0.0.0.0/0), and click Confirm.';
    }
    return res.status(500).json({ 
      error: 'Database context failure: ' + error.message, 
      details: error.message,
      suggestion: suggestFix || undefined
    });
  }
}
