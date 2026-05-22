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

export default async function handler(req, res) {
  // Set headers for XML
  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

  // Set standard CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const host = req.headers.host || 'aetherobjects.co';
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const baseUrl = `${protocol}://${host}`;

  let products = [];
  try {
    const { db } = await connectToDatabase();
    const doc = await db.collection('store_state').findOne({ _id: 'products' });
    if (doc && Array.isArray(doc.data)) {
      products = doc.data;
    }
  } catch (err) {
    console.warn('Sitemap DB connection offline, using fallback catalog routing:', err.message);
    // Dynamic fallback static catalog
    products = [
      { id: 'prod-1', name: 'Aether Walnut Desk Riser' },
      { id: 'prod-2', name: 'Boreal Brass Table Lamp' },
      { id: 'prod-3', name: 'Sable Horween Leather Journal' },
      { id: 'prod-4', name: 'Acoustic Wool Desk Mat' },
      { id: 'prod-5', name: 'Mono Precision Steel Clock' },
      { id: 'prod-6', name: 'Cortex Desk Organizer Tray' },
    ];
  }

  // Generate dynamic index structure url tags
  let productXmlEntries = '';
  products.forEach(p => {
    productXmlEntries += `
  <url>
    <loc>${baseUrl}/#product-${p.id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.82</priority>
  </url>`;
  });

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/?view=shop</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/?view=login</loc>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>${baseUrl}/?view=admin</loc>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>${productXmlEntries}
</urlset>`;

  // Compatibility wrapper end call
  if (typeof res.send === 'function') {
    return res.send(sitemapXml.trim());
  } else if (typeof res.end === 'function') {
    return res.end(sitemapXml.trim());
  }
}
