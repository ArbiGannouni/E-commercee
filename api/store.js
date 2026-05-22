import { MongoClient } from 'mongodb';

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }
  const uri = process.env.MONGODB_URI || 'mongodb+srv://jouhanarbi_db_user:kE3tZAKQ31KV4Xru@cluster0.mwrngyd.mongodb.net/?appName=Cluster0';
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('aether_store');
  cachedClient = client;
  cachedDb = db;
  return { client, db };
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
      // For Vercel/Express compat, parse body if it is still a string
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch (e) {
          return res.status(400).json({ error: 'Invalid JSON body string' });
        }
      }

      if (!body) {
        return res.status(400).json({ error: 'Missing request body' });
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
      const keys = ['products', 'orders', 'customers', 'promoCodes', 'settings', 'userCredentials', 'simulatedEmails'];
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
    return res.status(500).json({ error: 'Database context failure', details: error.message });
  }
}
